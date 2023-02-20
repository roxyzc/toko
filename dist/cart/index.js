"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyQuery_middleware_1 = require("../middlewares/verifyQuery.middleware");
const verifySchemas_middleware_1 = require("../middlewares/verifySchemas.middleware");
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const add_controller_1 = __importDefault(require("./add/controllers/add.controller"));
const checkUpdate_controller_1 = __importDefault(require("./get/controllers/checkUpdate.controller"));
const get_controller_1 = __importDefault(require("./get/controllers/get.controller"));
const route = (0, express_1.Router)();
route
    .route("/cart")
    .get(verifyToken_middleware_1.verifyToken, get_controller_1.default)
    .post(verifyToken_middleware_1.verifyToken, (0, verifyQuery_middleware_1.validateQuery)(verifyQuery_middleware_1.query.cart.add), (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Cart.add), add_controller_1.default);
route.get("/cart/checkUpdate", verifyToken_middleware_1.verifyToken, checkUpdate_controller_1.default);
exports.default = route;
