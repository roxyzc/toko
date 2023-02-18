"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const http_errors_1 = require("http-errors");
const logger_log_1 = __importDefault(require("../logs/logger.log"));
const notFound = (_req, _res, next) => {
    next(new http_errors_1.NotFound());
};
exports.notFound = notFound;
const errorHandler = (error, _req, res, _next) => {
    var _a, _b;
    logger_log_1.default.error(error.message);
    res.status(error.status || 500).json({
        success: false,
        error: {
            message: error.message,
            _message: (_b = (_a = error.parent) === null || _a === void 0 ? void 0 : _a.sqlMessage) !== null && _b !== void 0 ? _b : undefined,
        },
    });
};
exports.errorHandler = errorHandler;
