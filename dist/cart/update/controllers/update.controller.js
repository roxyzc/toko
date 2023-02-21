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
const product_model_1 = __importDefault(require("../../../models/product.model"));
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { is, ip } = req.query;
    const { userId } = req.USER;
    const { count } = req.body;
    try {
        yield cart_model_1.default.findOne({
            where: {
                idStore: is,
                idProduct: ip,
                userId,
            },
            attributes: ["count", "price", "totalPrice"],
            include: [{ model: product_model_1.default, as: "product", attributes: ["nameProduct", "stock"] }],
        })
            .then((value) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (count > (value === null || value === void 0 ? void 0 : value.product.stock)) {
                res.status(400).json({ success: false, error: { message: `remaining stock ${(_a = value === null || value === void 0 ? void 0 : value.product) === null || _a === void 0 ? void 0 : _a.stock}` } });
            }
            else {
                yield cart_model_1.default.update({
                    count,
                    totalPrice: count * Number(value === null || value === void 0 ? void 0 : value.getDataValue("price")),
                    updatedAt: Number(new Date().getTime()),
                }, {
                    where: {
                        idStore: is,
                        idProduct: ip,
                        userId,
                    },
                });
                res.status(200).json({ success: true, data: { message: "success" } });
            }
        }))
            .catch(error => {
            throw new Error(error);
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = update;
