import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { NotFound } from "http-errors";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFound());
};

export const errorHandler: ErrorRequestHandler = (
  error: any,
  _req,
  res,
  _next
) => {
  res.status(error.status || 500).json({
    success: false,
    error: {
      message: error.message,
      _message: error.parent?.sqlMessage ?? undefined,
    },
  });
};
