import { Request, Response, NextFunction } from "express";
import Token from "@model/token.model";

const logout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const token = req.headers["authorization"]?.split(" ")[1] ?? "";
  try {
    if (token === undefined) return res.status(400).json({ success: false, error: { message: "token required" } });
    await Token.destroy({ where: { accessToken: token } });
    return res.status(200).json({ success: true, error: { message: "logout successfully" } });
  } catch (error) {
    next(error);
  }
};

export default logout;
