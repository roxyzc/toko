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
const generateOtp_util_1 = require("../../../utils/generateOtp.util");
const sendEmail_util_1 = require("../../../utils/sendEmail.util");
const takeOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const otp = yield otp_model_1.default.findOne({ where: { email, type: "register" } });
        if (!otp) {
            return res
                .status(400)
                .json({ success: false, error: { message: "otp expired" } });
        }
        const createOtp = yield (0, generateOtp_util_1.generateOTP)();
        const valid = yield (0, sendEmail_util_1.sendEmail)(email, createOtp.otp);
        if (!valid) {
            throw new Error("failed to send email");
        }
        yield otp_model_1.default.update({
            otp: createOtp,
            expiredAt: Number(new Date().getTime()) + 300000,
        }, {
            where: {
                email,
            },
        });
        res.status(200).json({
            success: true,
            data: otp,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = takeOtp;
