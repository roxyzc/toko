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
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const otp_model_1 = __importDefault(require("../../../models/otp.model"));
const database_config_1 = __importDefault(require("../../../configs/database.config"));
const generateOtp_util_1 = __importDefault(require("../../../utils/generateOtp.util"));
const sendEmail_util_1 = require("../../../utils/sendEmail.util");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nama, email, password, ip } = req.body;
    const t = yield database_config_1.default.transaction();
    try {
        let id = new short_unique_id_1.default().randomUUID(16);
        let cekId = true;
        while (cekId) {
            const findUser = yield user_model_1.default.findOne({
                where: {
                    id,
                },
                attributes: ["nama"],
            });
            if (!findUser) {
                cekId = false;
            }
            else {
                id = new short_unique_id_1.default().randomUUID(8);
            }
        }
        const findUser = yield user_model_1.default.findOne({
            where: {
                email,
            },
            attributes: ["nama"],
        });
        if (findUser) {
            t.rollback();
            return res
                .status(400)
                .json({ success: false, error: { message: "user already exists" } });
        }
        const findUserInTableOtp = yield otp_model_1.default.findOne({
            where: { email, type: "register" },
        });
        if (findUserInTableOtp) {
            t.rollback();
            yield otp_model_1.default.destroy({ where: { email } });
            return res
                .status(400)
                .json({ success: false, error: { message: "otp already exists" } });
        }
        const user = yield user_model_1.default.create({
            id,
            nama: nama,
            email: email,
            password: password,
        }, { transaction: t });
        const otp = yield (0, generateOtp_util_1.default)(4);
        const createOtp = yield otp_model_1.default.create({
            ip,
            email: user.email,
            otp: otp,
            type: "register",
        }, { transaction: t });
        t.commit();
        const valid = yield (0, sendEmail_util_1.sendEmail)(email, createOtp.otp);
        if (!valid) {
            t.rollback();
            throw new Error("failed to send email");
        }
        res
            .status(200)
            .json({ success: true, data: { message: "Register successfully" } });
    }
    catch (error) {
        t.rollback();
        next(error);
    }
});
exports.default = register;
