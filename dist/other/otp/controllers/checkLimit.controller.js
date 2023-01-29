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
const checkLimitBeforeTakeTheOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip, email, type } = req.body;
    try {
        const findOtp = yield otp_model_1.default.findOne({
            where: { ip, email, type: type },
        });
        const user = yield user_model_1.default.findOne({ attributes: ["nama"], where: { email } });
        if (!user)
            return res
                .status(400)
                .json({ success: false, error: { message: "user not found" } });
        if (!findOtp) {
            return res.status(200).json({
                success: false,
                data: {
                    time: 0,
                    message: "just take it bro",
                },
            });
        }
        if (Number(new Date().getTime()) - Number(findOtp === null || findOtp === void 0 ? void 0 : findOtp.updatedAt) < 60000) {
            return res.status(200).json({
                success: true,
                data: { time: findOtp === null || findOtp === void 0 ? void 0 : findOtp.updatedAt, message: "<1" },
            });
        }
        res.status(200).json({
            success: true,
            data: { time: findOtp === null || findOtp === void 0 ? void 0 : findOtp.updatedAt, message: ">1" },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = checkLimitBeforeTakeTheOtp;
