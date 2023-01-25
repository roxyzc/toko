"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_controller_1 = __importDefault(require("./register/controllers/register.controller"));
const verifySchemas_middleware_1 = require("../middleware/verifySchemas.middleware");
const login_controller_1 = __importDefault(require("./login/controllers/login.controller"));
const verifyAccount_controller_1 = __importDefault(require("./verifyAccount/controllers/verifyAccount.controller"));
const verifyToken_middleware_1 = require("../middleware/verifyToken.middleware");
const token_controller_1 = __importDefault(require("./token/controllers/token.controller"));
const route = (0, express_1.Router)();
route.post("/register", (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Auth.register), register_controller_1.default);
route.post("/login", (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Auth.login), login_controller_1.default);
route.post("/verifyAccount", (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Auth.verifyOtp), verifyAccount_controller_1.default);
route.get("/refreshToken", verifyToken_middleware_1.checkExpiredToken, token_controller_1.default);
exports.default = route;
