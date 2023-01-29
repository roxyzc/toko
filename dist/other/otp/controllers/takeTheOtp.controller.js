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
const otp_model_1 = __importDefault(require("../../../models/otp.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const generateOtp_util_1 = require("../../../utils/generateOtp.util");
const sendEmail_util_1 = require("../../../utils/sendEmail.util");
const takeTheOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip, email, type } = req.body;
    try {
        const user = yield user_model_1.default.findOne({
            attributes: ["nama"],
            where: { email, status: "pending" },
        });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, error: { message: "user not found" } });
        }
        const otp = yield otp_model_1.default.findOne({
            where: { email, type: type },
        });
        const createOtp = yield (0, generateOtp_util_1.generateOTP)(4);
        const valid = yield (0, sendEmail_util_1.sendEmail)(email, createOtp);
        if (!valid) {
            throw new Error("failed to send email");
        }
        if (!otp) {
            yield otp_model_1.default.create({
                email,
                type: type,
                otp: createOtp,
                ip,
            });
            return res
                .status(200)
                .json({ success: true, data: { message: "otp resent successfully" } });
        }
        if (Number(new Date().getTime()) - Number(otp.updatedAt) < 60000) {
            return res.status(201).json({
                success: true,
                data: {
                    time: otp.updatedAt,
                    message: "-_-",
                },
            });
        }
        yield otp_model_1.default.update({
            otp: createOtp,
            type: type,
            updatedAt: Number(new Date().getTime()),
            expiredAt: Number(new Date().getTime()) + 180000,
        }, {
            where: {
                email,
            },
        });
        res.status(200).json({
            success: true,
            data: { message: "otp resent successfully" },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = takeTheOtp;
