import joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import logger from "../logs/logger.log";

const validateSchema = (schema: ObjectSchema) => {
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

const schema = {
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
  Store: {
    create: joi.object({
      nameStore: joi
        .string()
        .trim()
        .regex(/^[\w\s]+$/)
        .required()
        .label("Name store")
        .messages({
          "string.base": `{{#label}} should be a type of 'String'`,
          "string.empty": `{{#label}} cannot be an empty field`,
          "any.required": `{{#label}} is a required field`,
        }),
      image: joi.any().required().label("Image").messages({
        "any.required": `{{#label}} is a required field`,
      }),
    }),
    update: joi.object({
      nameStore: joi
        .string()
        .trim()
        .regex(/^[\w\s]+$/)
        .label("Name store"),
      discount: joi.number().integer().min(0).max(100).label("Discount"),
      tax: joi.number().integer().min(0).label("Tax"),
      image: joi.any().label("Image"),
    }),
    addC: joi.object({
      email: joi.string().email().required().label("Email").messages({
        "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
      }),
    }),
  },
  Product: {
    add: joi.object({
      nameProduct: joi
        .string()
        .label("Name Product")
        .trim()
        .regex(/^[\w\s]+$/)
        .min(2)
        .required()
        .messages({
          "string.base": `{{#label}} should be a type of 'text'`,
          "string.empty": `{{#label}} cannot be an empty field`,
          "string.min": `{{#label}} should have a minimum length of {#limit}`,
          "any.required": `{{#label}} is a required field`,
        }),
      price: joi.number().integer().label("Price").required().min(0).messages({
        "any.required": `{{#label}} is a required field`,
      }),
      discount: joi.number().integer().min(0).max(100).optional().label("Discount"),
      stoke: joi.number().integer().min(0).required().label("Stoke").messages({
        "any.required": `{{#label}} is a required field`,
      }),
      category: joi.string().trim().required().label("Category").messages({
        "any.required": `{{#label}} is a required field`,
      }),
      detail: joi.string().required().label("Detail").messages({
        "any.required": `{{#label}} is a required field`,
      }),
      image: joi.any().required().label("Image"),
    }),
    update: joi.object({
      nameProduct: joi
        .string()
        .label("Name Product")
        .trim()
        .regex(/^[\w\s]+$/)
        .min(2)
        .messages({
          "string.base": `{{#label}} should be a type of 'text'`,
          "string.empty": `{{#label}} cannot be an empty field`,
          "string.min": `{{#label}} should have a minimum length of {#limit}`,
        }),
      price: joi.number().integer().label("Price").min(0),
      discount: joi.number().integer().min(0).max(100).label("Discount"),
      stoke: joi.number().integer().min(0).label("Stoke"),
      category: joi.string().trim().label("Category"),
      detail: joi.string().label("Detail"),
      image: joi.any().label("Image"),
    }),
  },
  Cart: {
    add: joi.object({
      count: joi.number().integer().min(1).label("Count"),
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
};

export { validateSchema, schema };
