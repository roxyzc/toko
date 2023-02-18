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
const store_model_1 = __importDefault(require("../../../models/store.model"));
const sequelize_1 = require("sequelize");
const image_model_1 = __importDefault(require("../../../models/image.model"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const getStores = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.USER;
    try {
        const stores = yield store_model_1.default.findAll({
            where: { access: { [sequelize_1.Op.like]: `%${userId}%` } },
            attributes: ["idStore", "nameStore", "access"],
            include: [{ model: image_model_1.default, as: "image", attributes: ["secure_url"] }],
        });
        let data = [];
        stores.forEach((x, _i) => {
            var _a;
            const coba = Array.from(JSON.parse(x.access));
            const filter = coba.filter((v, _i) => v.userId === userId);
            data.push({
                idStore: x.getDataValue("idStore"),
                nameStore: x.getDataValue("nameStore"),
                role: filter[0].role,
                image: (_a = x.image) === null || _a === void 0 ? void 0 : _a.secure_url,
            });
        });
        if (data.length === 0)
            return res.status(202).json({ success: true, data: { message: "The user doesn't have a store yet" } });
        const encrypt = crypto_js_1.default.AES.encrypt(JSON.stringify(data), process.env.SALTHASHIDS).toString();
        res.status(200).json({
            success: true,
            data: {
                encrypt,
                decrypt: JSON.parse(crypto_js_1.default.AES.decrypt(encrypt, process.env.SALTHASHIDS).toString(crypto_js_1.default.enc.Utf8)),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = getStores;
