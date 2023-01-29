import { NextFunction, Request, Response } from "express";
import ShortUniqueId from "short-unique-id";
import User from "../../../models/user.model";
import Otp from "../../../models/otp.model";
import db from "../../../configs/database.config";
import { generateOTP } from "../../../utils/generateOtp.util";
import { sendEmail } from "../../../utils/sendEmail.util";
import { TYPE } from "../../../types/default";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { nama, email, password, ip } = req.body;
  const t = await db.transaction();
  try {
    let id = new ShortUniqueId().randomUUID(16);
    let cekId = true;
    while (cekId) {
      const findUser = await User.findOne({
        where: {
          id,
        },
        attributes: ["nama"],
      });
      if (!findUser) {
        cekId = false;
      } else {
        id = new ShortUniqueId().randomUUID(8);
      }
    }

    const findUser = await User.findOne({
      where: {
        email,
      },
      attributes: ["nama"],
    });

    if (findUser) {
      t.rollback();
      return res
        .status(400)
        .json({ success: false, error: { message: "user already exists" } });
    }

    const findUserInTableOtp = await Otp.findOne({
      where: { email, type: "register" },
    });
    if (findUserInTableOtp) {
      t.rollback();
      await Otp.destroy({ where: { email } });
      return res
        .status(400)
        .json({ success: false, error: { message: "otp already exists" } });
    }
    const user = await User.create(
      {
        id,
        nama: nama as string,
        email: email as string,
        password: password as string,
      },
      { transaction: t }
    );

    const otp = await generateOTP(4);
    const createOtp = await Otp.create(
      {
        ip,
        email: user.email as string,
        otp: otp as string,
        type: "register" as unknown as TYPE,
      },
      { transaction: t }
    );
    t.commit();
    const valid: Boolean = await sendEmail(
      email as string,
      createOtp.otp as string
    );
    if (!valid) {
      t.rollback();
      throw new Error("failed to send email");
    }
    res
      .status(200)
      .json({ success: true, data: { message: "Register successfully" } });
  } catch (error: any) {
    t.rollback();
    next(error);
  }
};

export default register;
