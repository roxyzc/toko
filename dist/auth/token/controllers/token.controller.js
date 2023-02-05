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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_model_1 = __importDefault(require("../../../models/token.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const generateToken_util_1 = require("../../../utils/generateToken.util");
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.USER;
        const findToken = yield token_model_1.default.findOne({ where: { accessToken: token } });
        jsonwebtoken_1.default.verify(findToken === null || findToken === void 0 ? void 0 : findToken.getDataValue("refreshToken"), process.env.REFRESHTOKENSECRET, (error, _decoded) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({
                attributes: ["id", "email", "nama", "role", "tokenId"],
                where: { tokenId: findToken === null || findToken === void 0 ? void 0 : findToken.getDataValue("tokenId") },
            });
            if (!user)
                return res.status(400).json({ success: false, error: { message: "user not found" } });
            if (error) {
                const { accessToken, refreshToken } = yield (0, generateToken_util_1.generateToken)(user.getDataValue("id"), user.getDataValue("email"), user.getDataValue("nama"), user.getDataValue("role"));
                yield token_model_1.default.update({ accessToken, refreshToken }, { where: { tokenId: user.getDataValue("tokenId") } });
                return res.status(200).json({ success: true, data: { accessToken } });
            }
            const { accessToken } = yield (0, generateToken_util_1.generateAccessToken)(user.getDataValue("id"), user.getDataValue("email"), user.getDataValue("nama"), user.getDataValue("role"));
            yield token_model_1.default.update({ accessToken }, { where: { tokenId: user.getDataValue("tokenId") } });
            return res.status(200).json({ success: true, data: { accessToken } });
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.default = refreshToken;
