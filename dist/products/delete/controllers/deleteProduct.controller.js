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
const image_model_1 = __importDefault(require("../../../models/image.model"));
const cloud_config_1 = __importDefault(require("../../../configs/cloud.config"));
const database_config_1 = __importDefault(require("../../../configs/database.config"));
const store_service_1 = require("../../../services/store.service");
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { is, ip } = req.query;
    const { userId } = req.USER;
    const t = yield database_config_1.default.transaction();
    try {
        if (!(yield (0, store_service_1.checkAccessUserInStore)(userId, is)))
            return res.status(400).json({ success: false, error: { message: "error" } });
        const product = yield product_model_1.default.findOne({
            where: {
                idStore: is,
                idProduct: ip,
            },
            include: [{ model: image_model_1.default, as: "image", attributes: ["idCloud"] }],
        });
        if (!product)
            return res.status(404).json({ success: false, error: { message: "product not found" } });
        yield image_model_1.default.destroy({
            where: {
                idImage: product.getDataValue("idImage"),
            },
            transaction: t,
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield product_model_1.default.destroy({
                where: {
                    idStore: is,
                    idProduct: ip,
                },
                transaction: t,
            });
        }))
            .catch(error => {
            t.rollback();
            throw new Error(error);
        });
        yield cloud_config_1.default.uploader.destroy(product.image.idCloud).catch(error => {
            t.rollback();
            throw new Error(error);
        });
        t.commit();
        res.status(200).json({ success: true, data: { message: "success" } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = deleteProduct;
