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
const image_model_1 = __importDefault(require("../../../models/image.model"));
const product_model_1 = __importDefault(require("../../../models/product.model"));
const sequelize_1 = require("sequelize");
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);
    let page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);
    let search = req.query.search === undefined || req.query.search === "" ? "" : req.query.search;
    let start = (page - 1) * limit;
    let end = page * limit;
    try {
        const products = yield product_model_1.default.findAndCountAll({
            where: {
                idStore: req.params.idStore,
                nameProduct: { [sequelize_1.Op.like]: `%${search}%` },
            },
            attributes: [
                "idProduct",
                "nameProduct",
                "price",
                "discount",
                "stoke",
                "detail",
                "category",
                "createdAt",
                "updatedAt",
            ],
            order: [["createdAt", "DESC"]],
            include: [{ model: image_model_1.default, as: "image", attributes: ["secure_url"] }],
            limit: limit,
            offset: start,
        });
        let count = products.count;
        let pagination = {};
        Object.assign(pagination, { totalRow: products.count, totalPage: Math.ceil(count / limit) });
        if (end < count) {
            Object.assign(pagination, { next: { page: page + 1, limit } });
        }
        if (start > 0) {
            Object.assign(pagination, { prev: { page: page - 1, limit } });
        }
        res.status(200).json({ success: true, pagination, data: products.rows });
    }
    catch (error) {
        next(error);
    }
});
exports.default = getProducts;
