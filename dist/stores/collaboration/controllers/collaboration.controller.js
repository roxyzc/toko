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
exports.accept = exports.add = void 0;
const sequelize_1 = require("sequelize");
const store_model_1 = __importDefault(require("../../../models/store.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const sendEmail_util_1 = require("../../../utils/sendEmail.util");
const add = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idStore } = req.params;
    const { email } = req.body;
    const { userId } = req.USER;
    try {
        const user = yield user_model_1.default.findOne({
            where: { email, status: { [sequelize_1.Op.eq]: "active" }, expiredAt: null },
            attributes: ["id", "nama"],
        });
        if (!user)
            return res.status(404).json({ success: false, error: { message: "user not found" } });
        const findUser = yield store_model_1.default.findAndCountAll({
            where: { access: { [sequelize_1.Op.and]: { [sequelize_1.Op.like]: `%${user.getDataValue("id")}%` } } },
            attributes: ["idStore", "nameStore"],
        });
        if (findUser.count >= 3)
            return res.status(400).json({ success: false, error: { message: "maximum 3" } });
        const cekUserOwnerOrEmployee = yield store_model_1.default.findOne({
            where: { access: { [sequelize_1.Op.and]: { [sequelize_1.Op.like]: `%${userId}%`, [sequelize_1.Op.notLike]: "%employee%" } } },
        });
        if (!cekUserOwnerOrEmployee)
            return res.status(403).json({ success: false, error: { message: "failed" } });
        const store = yield store_model_1.default.findOne({
            where: { idStore },
            attributes: ["idStore", "nameStore", "access"],
        });
        if (!store)
            return res.status(404).json({ success: false, error: { message: "store not found" } });
        const access = Array.from(JSON.parse(store.access));
        access.forEach((value) => {
            if (value.userId == user.getDataValue("id")) {
                throw new Error("user already exists");
            }
        });
        access.push(JSON.parse(JSON.stringify({ userId: user.getDataValue("id"), role: "employee", status: "pending" })));
        const valid = yield (0, sendEmail_util_1.sendEmailForCollaboration)(req, email, user.getDataValue("nama"), store.getDataValue("nameStore"), idStore);
        if (!valid)
            throw new Error("sendEmail failed");
        yield store_model_1.default.update({ access: JSON.stringify(access) }, { where: { idStore } });
        res.status(200).json({ succes: true, data: { message: "success" } });
    }
    catch (error) {
        if (error.message == "user already exists")
            error.status = 409;
        next(error);
    }
});
exports.add = add;
const accept = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idStore } = req.params;
    const { userId } = req.USER;
    try {
        const findUser = yield store_model_1.default.findAndCountAll({
            where: { access: { [sequelize_1.Op.and]: { [sequelize_1.Op.like]: `%${userId}%`, [sequelize_1.Op.notLike]: `%pending%` } } },
            attributes: ["idStore", "nameStore"],
        });
        if (findUser.count >= 3)
            return res.status(400).json({ success: false, error: { message: "maximum 3" } });
        const store = yield store_model_1.default.findOne({
            where: { idStore, access: { [sequelize_1.Op.like]: `%${userId}%` } },
            attributes: ["idStore", "nameStore", "access"],
        });
        if (!store)
            return res.status(404).json({ success: false, error: { message: "user not found" } });
        const access = Array.from(JSON.parse(store.access));
        let data = [];
        access.forEach((x, _i) => {
            if (x.userId === userId && (x === null || x === void 0 ? void 0 : x.status) === undefined)
                throw new Error("already verification");
            if (x.userId === userId && (x === null || x === void 0 ? void 0 : x.status) !== undefined)
                data.push({ userId, role: x.role });
            if (x.userId !== userId && (x === null || x === void 0 ? void 0 : x.status) !== undefined)
                data.push({ userId: x.userId, role: x.role, status: x.status });
            if (x.userId !== userId && (x === null || x === void 0 ? void 0 : x.status) === undefined)
                data.push({ userId: x.userId, role: x.role });
        });
        yield store_model_1.default.update({ access: JSON.stringify(data) }, { where: { idStore } });
        res.status(200).json({ succes: true, data: { message: "success" } });
    }
    catch (error) {
        if (error.message == "already verification")
            error.status = 409;
        next(error);
    }
});
exports.accept = accept;
