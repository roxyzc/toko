"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const takeTheOtp_controller_1 = __importDefault(require("./otp/controllers/takeTheOtp.controller"));
const checkLimit_controller_1 = __importDefault(require("./otp/controllers/checkLimit.controller"));
const cekEmail_controller_1 = __importDefault(require("./email/controllers/cekEmail.controller"));
const verifySchemas_middleware_1 = require("../middleware/verifySchemas.middleware");
const route = (0, express_1.Router)();
route.post("/otp", (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Other.otp), takeTheOtp_controller_1.default);
route.post("/otp/limit", (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Other.otp), checkLimit_controller_1.default);
route.post("/cekEmail", (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Other.cekEmail), cekEmail_controller_1.default);
exports.default = route;
