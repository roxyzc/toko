import upload from "@config/multer.config";
import { Request, Response, NextFunction } from "express";

const verifyFile = (req: Request, res: Response, next: NextFunction) => {
  return upload.single("image")(req, res, (error): any => {
    if (error && error.field === "image") return next(error);
    if (req.file === undefined) return next();
    req.body.image = req.file;
    next();
  });
};

export default verifyFile;
