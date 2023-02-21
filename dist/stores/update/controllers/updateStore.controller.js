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
const store_service_1 = require("../../../services/store.service");
const store_model_1 = __importDefault(require("../../../models/store.model"));
const image_model_1 = __importDefault(require("../../../models/image.model"));
const cloud_config_1 = __importDefault(require("../../../configs/cloud.config"));
const updateStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idStore } = req.params;
    const { userId } = req.USER;
    const { nameStore, tax, discount, image } = req.body;
    try {
        if (!(yield (0, store_service_1.checkAccessUserInStoreAsOwner)(userId, idStore)))
            return res.status(400).json({ success: false, error: { message: "You are not alowed to do that" } });
        if (image !== undefined) {
            yield store_model_1.default.findOne({
                where: {
                    idStore,
                },
                attributes: ["idImage"],
                include: [{ model: image_model_1.default, as: "image", attributes: ["idCloud"] }],
            }).then((value) => __awaiter(void 0, void 0, void 0, function* () {
                const { secure_url, public_id } = yield cloud_config_1.default.uploader.upload(image === null || image === void 0 ? void 0 : image.path, {
                    public_id: value === null || value === void 0 ? void 0 : value.image.idCloud,
                });
                yield image_model_1.default.update({ secure_url, idCloud: public_id }, {
                    where: {
                        idImage: value === null || value === void 0 ? void 0 : value.getDataValue("idImage"),
                    },
                });
            }));
        }
        yield store_model_1.default.update({
            nameStore,
            tax,
            discount,
            updatedAt: Number(new Date().getTime()),
        }, { where: { idStore } });
        res.status(200).json({ success: true, data: { message: "success" } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = updateStore;
