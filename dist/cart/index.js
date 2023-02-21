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
const delete_controller_1 = __importDefault(require("./delete/controllers/delete.controller"));
const get_controller_1 = __importDefault(require("./get/controllers/get.controller"));
const update_controller_1 = __importDefault(require("./update/controllers/update.controller"));
const route = (0, express_1.Router)();
route
    .route("/cart")
    .get(verifyToken_middleware_1.verifyToken, get_controller_1.default)
    .post(verifyToken_middleware_1.verifyToken, (0, verifyQuery_middleware_1.validateQuery)(verifyQuery_middleware_1.query.cart.addUpdateAndDelete), (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Cart.addAndUpdate), add_controller_1.default)
    .put(verifyToken_middleware_1.verifyToken, (0, verifyQuery_middleware_1.validateQuery)(verifyQuery_middleware_1.query.cart.addUpdateAndDelete), (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Cart.addAndUpdate), update_controller_1.default)
    .delete(verifyToken_middleware_1.verifyToken, (0, verifyQuery_middleware_1.validateQuery)(verifyQuery_middleware_1.query.cart.addUpdateAndDelete), delete_controller_1.default);
exports.default = route;
