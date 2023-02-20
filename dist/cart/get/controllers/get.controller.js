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
const cart_model_1 = __importDefault(require("../../../models/cart.model"));
const image_model_1 = __importDefault(require("../../../models/image.model"));
const product_model_1 = __importDefault(require("../../../models/product.model"));
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);
    let page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);
    let start = (page - 1) * limit;
    let end = page * limit;
    const { userId } = req.USER;
    try {
        const cart = yield cart_model_1.default.findAndCountAll({
            where: { userId },
            attributes: ["count", "price", "totalPrice"],
            include: [
                {
                    model: product_model_1.default,
                    as: "product",
                    attributes: ["nameProduct"],
                    include: [{ model: image_model_1.default, as: "image", attributes: ["secure_url"] }],
                },
            ],
            order: [["updatedAt", "ASC"]],
            limit: limit,
            offset: start,
        });
        let count = cart.count;
        let pagination = {};
        Object.assign(pagination, { totalRow: cart.count, totalPage: Math.ceil(count / limit) });
        if (end < count) {
            Object.assign(pagination, { next: { page: page + 1, limit, remaining: count - (start + limit) } });
        }
        if (start > 0) {
            Object.assign(pagination, { prev: { page: page - 1, limit, remaining: count - (count - start) } });
        }
        if (page > Math.ceil(count / limit)) {
            Object.assign(pagination, { prev: { Premaining: count } });
        }
        res.status(200).json({ success: true, pagination, data: cart });
    }
    catch (error) {
        next(error);
    }
});
exports.default = get;
