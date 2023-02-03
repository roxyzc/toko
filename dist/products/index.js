"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifySchemas_middleware_1 = require("../middlewares/verifySchemas.middleware");
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const add_controller_1 = __importDefault(require("./add/controllers/add.controller"));
const route = (0, express_1.Router)();
route.post("/:idStore", verifyToken_middleware_1.verifyToken, (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Product.add), add_controller_1.default);
exports.default = route;
