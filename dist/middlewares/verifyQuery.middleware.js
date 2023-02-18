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
exports.query = exports.validateQuery = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_log_1 = __importDefault(require("../logs/logger.log"));
const validateQuery = (schema) => {
    return (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.query);
            next();
        }
        catch (error) {
            logger_log_1.default.error(error.message);
            next(error);
        }
    });
};
exports.validateQuery = validateQuery;
const query = {
    product: {
        get: joi_1.default.object({
            limit: joi_1.default.string().optional().label("Label"),
            page: joi_1.default.string().optional().label("Page"),
            search: joi_1.default.string().optional().label("Search"),
        }),
        deleteAndUpdate: joi_1.default.object({
            is: joi_1.default.string().required().label("is"),
            ip: joi_1.default.string().required().label("ip"),
        }),
    },
};
exports.query = query;
