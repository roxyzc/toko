import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { NotFound } from "http-errors";
import logger from "../logs/logger.log";

const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFound());
};

const errorHandler: ErrorRequestHandler = (error: any, _req, res, _next) => {
  logger.error(error.message);
  res.status(error.status || 500).json({
    success: false,
    error: {
      message: error.message,
      _message: error.parent?.sqlMessage ?? undefined,
    },
  });
};

export { notFound, errorHandler };
