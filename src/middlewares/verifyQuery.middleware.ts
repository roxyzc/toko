import joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import logger from "../logs/logger.log";

const validateQuery = (schema: ObjectSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.query);
      next();
    } catch (error: any) {
      logger.error(error.message);
      next(error);
    }
  };
};

const query = {
  product: {
    get: joi.object({
      limit: joi.string().optional().label("Label"),
      page: joi.string().optional().label("Page"),
      search: joi.string().optional().label("Search"),
    }),
  },
};

export { validateQuery, query };
