import { Request, Response, NextFunction } from "express";
import Otp from "../../../models/otp.model";
import User from "../../../models/user.model";
import { STATUS, TYPE } from "../../../types/default";
import { generateOTP } from "../../../utils/generateOtp.util";
import { sendEmail } from "../../../utils/sendEmail.util";

const takeTheOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { ip, email, type } = req.body;
  try {
    const user = await User.findOne({
      attributes: ["nama"],
      where: { email, status: "pending" as unknown as STATUS },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: { message: "user not found" } });
    }

    const otp = await Otp.findOne({
      where: { email, type: type as unknown as TYPE },
    });

    const createOtp = await generateOTP(4);
    const valid: Boolean = await sendEmail(
      email as string,
      createOtp as string
    );
    if (!valid) {
      throw new Error("failed to send email");
    }
    if (!otp) {
      await Otp.create({
        email,
        type: type as unknown as TYPE,
        otp: createOtp,
        ip,
      });
      return res
        .status(200)
        .json({ success: true, data: { message: "otp resent successfully" } });
    }

    if (Number(new Date().getTime()) - Number(otp.updatedAt) < 60000) {
      return res.status(201).json({
        success: true,
        data: {
          time: otp.updatedAt,
          message: "-_-",
        },
      });
    }

    await Otp.update(
      {
        otp: createOtp,
        type: type as unknown as TYPE,
        updatedAt: Number(new Date().getTime()),
        expiredAt: Number(new Date().getTime()) + 180000,
      },
      {
        where: {
          email,
        },
      }
    );
    res.status(200).json({
      success: true,
      data: { message: "otp resent successfully" },
    });
  } catch (error) {
    next(error);
  }
};

export default takeTheOtp;
