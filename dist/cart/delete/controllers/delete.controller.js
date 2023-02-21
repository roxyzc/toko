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
const deleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { is, ip } = req.query;
    const { userId } = req.USER;
    try {
        const cart = yield cart_model_1.default.destroy({
            where: {
                idStore: is,
                idProduct: ip,
                userId,
            },
        });
        if (!cart) {
            return res.status(404).json({ success: false, error: { message: "cart not found" } });
        }
        res.status(200).json({ success: true, data: { message: "success" } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = deleteCart;
