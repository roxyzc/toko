"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.validateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_log_1 = __importDefault(require("../logs/logger.log"));
const validateSchema = (schema) => {
    return (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            logger_log_1.default.error(error.message);
            next(error);
        }
    });
};
exports.validateSchema = validateSchema;
const schema = {
    Auth: {
        register: joi_1.default.object({
            nama: joi_1.default
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
            email: joi_1.default.string().email().label("Email").required().messages({
                "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
            ip: joi_1.default.string().required().label("Ip").messages({
                "string.base": `{{#label}} should be a type of 'text'`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
            password: joi_1.default.string().min(8).max(30).label("Password").required().messages({
                "string.empty": `{{#label}} cannot be an empty field`,
                "string.min": `{{#label}} should have a minimum length of {#limit}`,
                "string.max": `{{#label}} must be less than or equal to {#limit}`,
                "any.required": `{{#label}} is a required field`,
            }),
            confirmPassword: joi_1.default.any().equal(joi_1.default.ref("password")).required().label("Confirm password").messages({
                "any.only": "{{#label}} does not match",
            }),
        }),
        login: joi_1.default.object({
            email: joi_1.default.string().email().label("Email").required().messages({
                "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
            password: joi_1.default.string().min(8).max(30).label("Password").required().messages({
                "string.empty": `{{#label}} cannot be an empty field`,
                "string.min": `{{#label}} should have a minimum length of {#limit}`,
                "string.max": `{{#label}} must be less than or equal to {#limit}`,
                "any.required": `{{#label}} is a required field`,
            }),
        }),
        verifyOtp: joi_1.default.object({
            otp: joi_1.default.string().label("Otp").required().messages({
                "string.base": `{{#label}} should be a type of 'text'`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
        }),
    },
    Store: {
        create: joi_1.default.object({
            nameStore: joi_1.default
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
            image: joi_1.default.any().required().label("Image").messages({
                "any.required": `{{#label}} is a required field`,
            }),
        }),
        update: joi_1.default.object({
            nameStore: joi_1.default
                .string()
                .trim()
                .regex(/^[\w\s]+$/)
                .label("Name store"),
            discount: joi_1.default.number().integer().min(0).max(100).label("Discount"),
            tax: joi_1.default.number().integer().min(0).label("Tax"),
            image: joi_1.default.any().label("Image"),
        }),
        addC: joi_1.default.object({
            email: joi_1.default.string().email().required().label("Email").messages({
                "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
        }),
    },
    Product: {
        add: joi_1.default.object({
            nameProduct: joi_1.default
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
            price: joi_1.default.number().integer().label("Price").required().min(0).messages({
                "any.required": `{{#label}} is a required field`,
            }),
            discount: joi_1.default.number().integer().min(0).max(100).optional().label("Discount"),
            stock: joi_1.default.number().integer().min(0).required().label("Stock").messages({
                "any.required": `{{#label}} is a required field`,
            }),
            category: joi_1.default.string().trim().required().label("Category").messages({
                "any.required": `{{#label}} is a required field`,
            }),
            detail: joi_1.default.string().required().label("Detail").messages({
                "any.required": `{{#label}} is a required field`,
            }),
            image: joi_1.default.any().required().label("Image"),
        }),
        update: joi_1.default.object({
            nameProduct: joi_1.default
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
            price: joi_1.default.number().integer().label("Price").min(0),
            discount: joi_1.default.number().integer().min(0).max(100).label("Discount"),
            stock: joi_1.default.number().integer().min(0).label("Stock"),
            category: joi_1.default.string().trim().label("Category"),
            detail: joi_1.default.string().label("Detail"),
            image: joi_1.default.any().label("Image"),
        }),
    },
    Cart: {
        addAndUpdate: joi_1.default.object({
            count: joi_1.default.number().integer().min(1).label("Count"),
        }),
    },
    Other: {
        cekEmail: joi_1.default.object({
            email: joi_1.default.string().email().label("Email").required().messages({
                "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
        }),
        otp: joi_1.default.object({
            ip: joi_1.default.string().required().label("Ip").messages({
                "string.base": `{{#label}} should be a type of 'text'`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
            email: joi_1.default.string().email().label("Email").required().messages({
                "string.email": `'{{#label}}' in Email must be a valid {{#label}}`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
            type: joi_1.default.string().valid("register", "forgotPassword").required().label("Type").messages({
                "any.only": `{{#label}} {#value} is missing`,
                "string.base": `{{#label}} should be a type of 'String'`,
                "string.empty": `{{#label}} cannot be an empty field`,
                "any.required": `{{#label}} is a required field`,
            }),
        }),
    },
};
exports.schema = schema;
