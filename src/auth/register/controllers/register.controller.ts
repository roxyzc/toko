import { Request, Response } from "express";

const register = (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: req.body });
};

export default register;
