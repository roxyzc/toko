import upload from "@config/multer.config";
import { Request, Response, NextFunction } from "express";

const verifyFile = (req: Request, res: Response, next: NextFunction) => {
  return upload.single("logo")(req, res, (error): any => {
    if (error) return next(error);
    if (req.file === undefined) return next();
    req.body.logo = req.file;
    next();
  });
};

export default verifyFile;
