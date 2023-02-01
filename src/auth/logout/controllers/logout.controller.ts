import { Request, Response, NextFunction } from "express";
import Token from "@model/token.model";

const logout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const token = req.headers["authorization"]?.split(" ")[1] ?? "";
  try {
    await Token.destroy({ where: { accessToken: token } });
    return res.status(200).json({ success: true, error: { message: "logout successfully" } });
  } catch (error) {
    next(error);
  }
};

export default logout;
