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
const product_model_1 = __importDefault(require("../../../models/product.model"));
const cloud_config_1 = __importDefault(require("../../../configs/cloud.config"));
const image_model_1 = __importDefault(require("../../../models/image.model"));
const database_config_1 = __importDefault(require("../../../configs/database.config"));
const sequelize_1 = require("sequelize");
const store_service_1 = require("../../../services/store.service");
const deleteStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idStore } = req.params;
    const { userId } = req.USER;
    const t = yield database_config_1.default.transaction();
    try {
        if (!(yield (0, store_service_1.checkAccessUserInStoreAsOwner)(userId, idStore)))
            return res.status(403).json({ success: false, error: { message: "You are not alowed to do that" } });
        yield store_model_1.default.destroy({ where: { idStore }, transaction: t })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield product_model_1.default.destroy({
                where: {
                    idStore,
                },
                transaction: t,
            });
        }))
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield image_model_1.default.destroy({
                where: {
                    idCloud: {
                        [sequelize_1.Op.like]: `%project/${idStore}%`,
                    },
                },
                transaction: t,
            });
        }))
            .catch(error => {
            t.rollback();
            throw new Error(error);
        });
        yield cloud_config_1.default.api.delete_resources_by_prefix(`project/${idStore}`).catch(() => {
            t.rollback();
            throw new Error("error");
        });
        t.commit();
    }
    catch (error) {
        return next(error);
    }
    try {
        yield cloud_config_1.default.api.delete_folder(`project/${idStore}`);
        res.status(200).json({ success: true, data: { message: "success" } });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = deleteStore;
