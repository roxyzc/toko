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
const store_model_1 = __importDefault(require("../../../models/store.model"));
const check = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.USER;
    try {
        yield cart_model_1.default.findAll({ where: { userId }, attributes: ["count", "idStore", "idProduct"] }).then(value => {
            value.forEach((value) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const product = yield product_model_1.default.findOne({
                    where: {
                        idStore: value === null || value === void 0 ? void 0 : value.idStore,
                        idProduct: value === null || value === void 0 ? void 0 : value.idProduct,
                    },
                    attributes: ["discount", "price"],
                    include: [{ model: store_model_1.default, as: "store", attributes: ["discount"] }],
                });
                if (!product) {
                    yield cart_model_1.default.destroy({
                        where: {
                            idStore: value === null || value === void 0 ? void 0 : value.idStore,
                            idProduct: value === null || value === void 0 ? void 0 : value.idProduct,
                            userId,
                        },
                    });
                    return;
                }
                let price = Number(product === null || product === void 0 ? void 0 : product.getDataValue("discount")) == 0
                    ? Number(product === null || product === void 0 ? void 0 : product.getDataValue("price"))
                    : Number(product === null || product === void 0 ? void 0 : product.getDataValue("price")) -
                        Number(product === null || product === void 0 ? void 0 : product.getDataValue("price")) * (Number(product === null || product === void 0 ? void 0 : product.getDataValue("discount")) / 100);
                price = Number((_a = product.store) === null || _a === void 0 ? void 0 : _a.discount) == 0 ? price : price - price * (Number((_b = product.store) === null || _b === void 0 ? void 0 : _b.discount) / 100);
                yield cart_model_1.default.update({
                    price,
                    totalPrice: (value === null || value === void 0 ? void 0 : value.count) * Number(price),
                }, {
                    where: {
                        idStore: value === null || value === void 0 ? void 0 : value.idStore,
                        idProduct: value === null || value === void 0 ? void 0 : value.idProduct,
                        userId,
                    },
                });
            }));
        });
        res.status(200).json({ success: true, data: { message: "success" } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = check;
