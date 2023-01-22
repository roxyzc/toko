import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import { STATUS } from "../../../types/default";
// import bcrypt from "bcrypt";

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({
      where: {
        email,
      },
    });
    if (!findUser)
      return res
        .status(400)
        .json({ success: false, error: { message: "user not found" } });

    if (findUser.status !== ("active" as unknown as STATUS))
      return res
        .status(400)
        .json({ success: false, error: { message: "verify first bro" } });

    const valid = await findUser.comparePassword?.(password as string);
    if (!valid)
      return res
        .status(400)
        .json({ success: false, error: { message: "password invalid" } });
    res.status(200).json({ success: true, message: "Login successfully" });
  } catch (error) {
    next(error);
  }
};

export default login;
