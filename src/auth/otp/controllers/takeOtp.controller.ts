import { Request, Response, NextFunction } from "express";
import Otp from "../../../models/otp.model";
import { generateOTP } from "../../../utils/generateOtp.util";
import { sendEmail } from "../../../utils/sendEmail.util";

const takeOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email } = req.body;
  try {
    const otp = await Otp.findOne({ where: { email, type: "register" } });
    if (!otp) {
      return res
        .status(400)
        .json({ success: false, error: { message: "otp expired" } });
    }
    const createOtp = await generateOTP();
    const valid: Boolean = await sendEmail(
      email as string,
      createOtp.otp as string
    );
    if (!valid) {
      throw new Error("failed to send email");
    }
    await Otp.update(
      {
        otp: createOtp,
        expiredAt: Number(new Date().getTime()) + 300000,
      },
      {
        where: {
          email,
        },
      }
    );
    res.status(200).json({
      success: true,
      data: otp,
    });
  } catch (error) {
    next(error);
  }
};

export default takeOtp;
