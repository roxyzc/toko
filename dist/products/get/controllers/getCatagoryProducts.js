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
const product_model_1 = __importDefault(require("../../../models/product.model"));
const getCatagoryProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idStore } = req.params;
    try {
        const products = yield product_model_1.default.findAll({ where: { idStore }, attributes: ["category"] });
        let data = [];
        products.forEach((value) => __awaiter(void 0, void 0, void 0, function* () {
            const cek = data.findIndex(obj => obj.category === value.getDataValue("category"));
            if (cek === -1) {
                data.push({ category: value.getDataValue("category"), count: 1 });
            }
            else {
                data[cek].count += 1;
            }
        }));
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.default = getCatagoryProducts;
