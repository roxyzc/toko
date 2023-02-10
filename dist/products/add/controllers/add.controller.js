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
const store_model_1 = __importDefault(require("../../../models/store.model"));
const image_model_1 = __importDefault(require("../../../models/image.model"));
const cloud_config_1 = __importDefault(require("../../../configs/cloud.config"));
const sequelize_1 = require("sequelize");
const addProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nameProduct, price, discount = 0, stoke, category, detail, image } = req.body;
    const { userId } = req.USER;
    const { idStore } = req.params;
    try {
        const findUserInStores = yield store_model_1.default.findOne({
            where: {
                [sequelize_1.Op.and]: {
                    idStore,
                    access: {
                        [sequelize_1.Op.like]: `%${userId}%`,
                    },
                },
            },
            attributes: ["idStore"],
        });
        if (!findUserInStores)
            return res.status(400).json({ success: false, error: { message: "-______-" } });
        const { secure_url, public_id } = yield cloud_config_1.default.uploader.upload(image === null || image === void 0 ? void 0 : image.path, {
            folder: `project/${findUserInStores.getDataValue("idStore")}`,
        });
        yield image_model_1.default.create({
            idCloud: public_id,
            secure_url: secure_url,
        })
            .then((x) => __awaiter(void 0, void 0, void 0, function* () {
            yield product_model_1.default.create({
                idStore,
                nameProduct,
                price,
                discount,
                stoke,
                category: String(category).toLowerCase(),
                detail,
                idImage: x.getDataValue("idImage"),
            });
        }))
            .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            yield cloud_config_1.default.uploader.destroy(public_id);
            throw new Error(error);
        }));
        res.status(200).json({ success: true, data: { message: "success" } });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.default = addProduct;
