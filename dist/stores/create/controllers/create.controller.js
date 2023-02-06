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
const sequelize_1 = require("sequelize");
const store_model_1 = __importDefault(require("../../../models/store.model"));
const image_model_1 = __importDefault(require("../../../models/image.model"));
const generateOtp_util_1 = __importDefault(require("../../../utils/generateOtp.util"));
const cloud_config_1 = __importDefault(require("../../../configs/cloud.config"));
const hashids_1 = __importDefault(require("hashids"));
const createStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nameStore, logo } = req.body;
    const { userId } = req.USER;
    const hash = new hashids_1.default(process.env.SALTHASHIDS, 16);
    try {
        const store = yield store_model_1.default.findAndCountAll({
            where: {
                access: {
                    [sequelize_1.Op.like]: `%${userId}%`,
                },
            },
            attributes: ["idStore", "nameStore"],
        });
        if (store.count === 3)
            return res.status(400).json({ success: false, error: { message: "maximum 3" } });
        let id = yield (0, generateOtp_util_1.default)(4);
        let valid = true;
        while (valid) {
            const checkId = yield store_model_1.default.findOne({
                where: {
                    idStore: hash.encode(id),
                },
            });
            if (!checkId) {
                valid = false;
            }
            else {
                id = yield (0, generateOtp_util_1.default)(4);
            }
        }
        const { secure_url, public_id } = yield cloud_config_1.default.uploader.upload(logo === null || logo === void 0 ? void 0 : logo.path);
        yield image_model_1.default.create({
            idCloud: public_id,
            secure_url: secure_url,
        })
            .then((x) => __awaiter(void 0, void 0, void 0, function* () {
            yield store_model_1.default.create({
                idStore: hash.encode(id),
                nameStore,
                idCloud: x.getDataValue("idCloud"),
                access: JSON.stringify([{ userId, role: "owner" }]),
            });
        }))
            .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                yield cloud_config_1.default.uploader.destroy(public_id);
            }
        }));
        res.status(200).json({
            success: true,
            data: { message: "create store successfully" },
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.default = createStore;
