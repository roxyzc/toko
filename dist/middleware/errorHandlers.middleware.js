"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const http_errors_1 = require("http-errors");
const notFound = (_req, _res, next) => {
    next(new http_errors_1.NotFound());
};
exports.notFound = notFound;
const errorHandler = (error, _req, res, _next) => {
    var _a;
    res.status(error.status || 500).json({
        success: false,
        error: {
            message: error.message,
            _message: (_a = error.parent.sqlMessage) !== null && _a !== void 0 ? _a : undefined,
        },
    });
};
exports.errorHandler = errorHandler;
