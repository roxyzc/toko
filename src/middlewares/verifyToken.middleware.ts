import { Request, Response, NextFunction } from "express";
import Token from "../models/token.model";
import jwt from "jsonwebtoken";

const findTokenInDatabase = async (token: string): Promise<any> => {
  return (await Token.findOne({ where: { accessToken: token } })) === null ? false : true;
};

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(499).json({ success: false, error: { message: "token required" } });
    const token = authHeader.split(" ")[1];
    const findToken = await findTokenInDatabase(token);
    if (!findToken) return res.status(400).json({ success: false, error: { message: "token invalid" } });
    jwt.verify(token, process.env.ACCESSTOKENSECRET as string, async (error, decoded): Promise<any> => {
      if (error) return res.status(401).json({ status: false, error: { message: "token expired" } });
      req.USER = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const verifyTokenAndAuthorization = (req: Request, res: Response, next: NextFunction): any => {
  try {
    verifyToken(req, res, () => {
      const { id, role } = req.USER;
      if (role === "admin" || id === req.params.id) return next();
      res.status(403).json({
        success: false,
        message: "You are not alowed to do that",
      });
    });
  } catch (error) {
    next(error);
  }
};

const verifyTokenAdmin = (req: Request, res: Response, next: NextFunction): any => {
  try {
    verifyToken(req, res, () => {
      const { role } = req.USER;
      if (role === "admin") return next();
      res.status(403).json({
        success: false,
        message: "You are not alowed to do that",
      });
    });
  } catch (error) {
    next(error);
  }
};

const checkExpiredToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(499).json({ success: false, error: { message: "token required" } });
    const token = authHeader.split(" ")[1];

    const findToken = await findTokenInDatabase(token);
    if (!findToken) return res.status(400).json({ success: false, error: { message: "token invalid" } });
    jwt.verify(token as string, process.env.ACCESSTOKENSECRET as string, async (error, _decoded): Promise<any> => {
      if (!error)
        return res.status(401).json({
          success: false,
          error: { message: "Your token has not expired" },
        });
      req.USER = { token };
      next();
    });
  } catch (error) {
    next(error);
  }
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAdmin, checkExpiredToken };
