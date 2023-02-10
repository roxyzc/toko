"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyFile_middleware_1 = __importDefault(require("../middlewares/verifyFile.middleware"));
const verifyQuery_middleware_1 = require("../middlewares/verifyQuery.middleware");
const verifySchemas_middleware_1 = require("../middlewares/verifySchemas.middleware");
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const add_controller_1 = __importDefault(require("./add/controllers/add.controller"));
const getCatagoryProducts_1 = __importDefault(require("./get/controllers/getCatagoryProducts"));
const getProduct_controller_1 = __importDefault(require("./get/controllers/getProduct.controller"));
const route = (0, express_1.Router)();
route.post("/:idStore", verifyToken_middleware_1.verifyToken, verifyFile_middleware_1.default, (0, verifySchemas_middleware_1.validateSchema)(verifySchemas_middleware_1.schema.Product.add), add_controller_1.default);
route.get("/:idStore", verifyToken_middleware_1.verifyToken, (0, verifyQuery_middleware_1.validateQuery)(verifyQuery_middleware_1.query.product.get), getProduct_controller_1.default);
route.get("/category/:idStore", verifyToken_middleware_1.verifyToken, getCatagoryProducts_1.default);
exports.default = route;
