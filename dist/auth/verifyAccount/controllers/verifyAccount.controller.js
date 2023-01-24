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
const verifyAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    try {
        const findOtpInTable = yield otp_model_1.default.findOne({
            where: { otp, type: "register" },
        });
        if (!findOtpInTable)
            return res
                .status(400)
                .json({ success: false, error: { message: "otp invalid" } });
        if (Number(findOtpInTable.getDataValue("expiredAt")) <
            Number(new Date().getTime())) {
            yield otp_model_1.default.destroy({
                where: {
                    otp,
                    type: "register",
                },
            });
            return res
                .status(400)
                .json({ success: false, error: { message: "otp expired" } });
        }
        const user = yield user_model_1.default.findOne({
            where: { email: findOtpInTable.getDataValue("email") },
        });
        if (!user ||
            user.getDataValue("expiredAt") === null ||
            user.getDataValue("status") === "active") {
            yield otp_model_1.default.destroy({
                where: {
                    otp,
                    type: "register",
                },
            });
            return res
                .status(200)
                .json({ success: false, error: { message: "user not found" } });
        }
        if (Number(user.getDataValue("expiredAt")) < Number(new Date().getTime())) {
            yield user_model_1.default.destroy({
                where: { email: findOtpInTable.getDataValue("email") },
            });
            yield otp_model_1.default.destroy({
                where: {
                    otp,
                    type: "register",
                },
            });
            return res
                .status(400)
                .json({ success: false, error: { message: "account expired" } });
        }
        yield user_model_1.default.update({ status: "active", expiredAt: null }, { where: { email: findOtpInTable.getDataValue("email") } });
        const destroyOtp = yield otp_model_1.default.destroy({
            where: {
                otp,
                type: "register",
            },
        });
        res.status(200).json({
            success: true,
            message: "verification account successfully",
            data: destroyOtp,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = verifyAccount;
