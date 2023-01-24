import { Request, Response, NextFunction } from "express";
import Otp from "../../../models/otp.model";
import User from "../../../models/user.model";
import { TYPE } from "../../../types/default";

const checkLimitBeforeTakeTheOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { ip, email, type } = req.body;
  try {
    const findOtp = await Otp.findOne({
      where: { ip, email, type: type as unknown as TYPE },
    });
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ success: false, error: { message: "user not found" } });
    if (!findOtp) {
      return res.status(200).json({
        success: false,
        data: {
          time: 0,
          message: "just take it bro",
        },
      });
    }
    if (Number(new Date().getTime()) - Number(findOtp?.updatedAt) < 60000) {
      return res.status(200).json({
        success: true,
        data: { time: findOtp?.updatedAt, message: "<1" },
      });
    }

    res.status(200).json({
      success: true,
      data: { time: findOtp?.updatedAt, message: ">1" },
    });
  } catch (error) {
    next(error);
  }
};

export default checkLimitBeforeTakeTheOtp;
