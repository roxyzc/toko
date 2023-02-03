import joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../logs/logger.log";

export const validateSchema = (schema: ObjectSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error: any) {
      logger.error(error.message);
      next(error);
    }
  };
};

export const schema = {
  Auth: {
    register: joi.object({
      nama: joi
        .string()
        .trim()
        .min(3)
        .max(50)
        .label("Nama")
        .required()
        .regex(/^[a-zA-Z .]+$/i, { invert: false })
        .messages({
          "string.base": `{{#label}} should be a type of 'text'`,
          "string.empty": `{{#label}} cannot be an empty field`,
          "string.min": `{{#label}} should have a minimum length of {#limit}`,
          "string.max": `{{#label}} must be less than or equal to {#limit}`,
          "any.required": `{{#label}} is a required field`,
        }),
      email: joi.string().email().label("Email").required().messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
      ip: joi.string().required().label("Ip").messages({
        "string.base": `{{#label}} should be a type of 'text'`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
      password: joi.string().min(8).max(30).label("Password").required().messages({
        "string.empty": `{{#label}} cannot be an empty field`,
        "string.min": `{{#label}} should have a minimum length of {#limit}`,
        "string.max": `{{#label}} must be less than or equal to {#limit}`,
        "any.required": `{{#label}} is a required field`,
      }),
      confirmPassword: joi.any().equal(joi.ref("password")).required().label("Confirm password").messages({
        "any.only": "{{#label}} does not match",
      }),
    }),
    login: joi.object({
      email: joi.string().email().label("Email").required().messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
      password: joi.string().min(8).max(30).label("Password").required().messages({
        "string.empty": `{{#label}} cannot be an empty field`,
        "string.min": `{{#label}} should have a minimum length of {#limit}`,
        "string.max": `{{#label}} must be less than or equal to {#limit}`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
    verifyOtp: joi.object({
      otp: joi.string().label("Otp").required().messages({
        "string.base": `{{#label}} should be a type of 'text'`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
  },
  Product: {
    add: joi.object({
      nameProduct: joi.string().label("Name Product").trim().min(2).required().messages({
        "string.base": `{{#label}} should be a type of 'text'`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "string.min": `{{#label}} should have a minimum length of {#limit}`,
        "any.required": `{{#label}} is a required field`,
      }),
      price: joi.number().integer().label("Price").required().min(1).messages({
        "any.required": `{{#label}} is a required field`,
      }),
    }),
  },
  Other: {
    cekEmail: joi.object({
      email: joi.string().email().label("Email").required().messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
    otp: joi.object({
      ip: joi.string().required().label("Ip").messages({
        "string.base": `{{#label}} should be a type of 'text'`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
      email: joi.string().email().label("Email").required().messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
      type: joi.string().valid("register", "forgotPassword").required().label("Type").messages({
        "any.only": `{{#label}} {#value} is missing`,
        "string.base": `{{#label}} should be a type of 'String'`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
  },
  store: {
    create: joi.object({
      nameStore: joi.string().required().label("Name store").messages({
        "string.base": `{{#label}} should be a type of 'String'`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
    addC: joi.object({
      email: joi.string().email().required().label("Email").messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
  },
};
