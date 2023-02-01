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
exports.addAccess = exports.createStore = void 0;
const sequelize_1 = require("sequelize");
const store_model_1 = __importDefault(require("../../../models/store.model"));
const generateOtp_util_1 = __importDefault(require("../../../utils/generateOtp.util"));
const createStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nameStore } = req.body;
    const { userId } = req.USER;
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
                    idStore: Number(id),
                },
            });
            if (!checkId) {
                valid = false;
            }
            else {
                id = yield (0, generateOtp_util_1.default)(4);
            }
        }
        yield store_model_1.default.create({
            idStore: Number(id),
            nameStore,
            access: JSON.stringify([{ userId, role: "owner" }]),
        });
        res.status(200).json({
            success: true,
            data: { message: "create store successfully" },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createStore = createStore;
const addAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.USER;
    try {
        const findUser = yield store_model_1.default.findAndCountAll({
            where: { access: { [sequelize_1.Op.like]: `%${userId}%` } },
            attributes: ["idStore", "nameStore"],
        });
        if (findUser.count >= 3)
            return res.status(400).json({ success: false, error: { message: "maximum 3" } });
        const store = yield store_model_1.default.findOne({
            where: { idStore: Number(id) },
            attributes: ["idStore", "nameStore", "access"],
        });
        if (!store)
            return res.status(404).json({ success: false, error: { message: "store not found" } });
        const access = Array.from(JSON.parse(store.access));
        access.forEach((value) => {
            if (value.userId == userId) {
                throw new Error("user already exists");
            }
        });
        access.push(JSON.parse(JSON.stringify({ userId, role: "employee" })));
        yield store_model_1.default.update({ access: JSON.stringify(access) }, { where: { idStore: id } });
        res.status(200).json({ succes: true, data: { message: "success" } });
    }
    catch (error) {
        if (error.message == "user already exists")
            error.status = 409;
        next(error);
    }
});
exports.addAccess = addAccess;
