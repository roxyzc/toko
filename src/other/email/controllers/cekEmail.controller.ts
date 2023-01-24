import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";

const cekEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(200)
        .json({ success: true, data: { message: "email available" } });
    res
      .status(200)
      .json({ success: true, data: { message: "email not available" } });
  } catch (error) {
    next(error);
  }
};

export default cekEmail;
