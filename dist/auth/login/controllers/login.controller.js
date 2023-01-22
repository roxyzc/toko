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
const token_model_1 = __importDefault(require("../../../models/token.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const generateToken_util_1 = require("../../../utils/generateToken.util");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    try {
        const findUser = yield user_model_1.default.findOne({
            include: token_model_1.default,
            where: {
                email,
            },
        });
        if (!findUser)
            return res
                .status(400)
                .json({ success: false, error: { message: "user not found" } });
        if (findUser.status !== "active")
            return res
                .status(400)
                .json({ success: false, error: { message: "verify first bro" } });
        const valid = yield ((_a = findUser.comparePassword) === null || _a === void 0 ? void 0 : _a.call(findUser, password));
        if (!valid)
            return res
                .status(400)
                .json({ success: false, error: { message: "password invalid" } });
        const { accessToken, refreshToken } = yield (0, generateToken_util_1.generateToken)(findUser.getDataValue("id"), String(findUser.getDataValue("role")));
        if (findUser.tokenId === null || findUser.tokenId === undefined) {
            const createToken = yield token_model_1.default.create({ accessToken, refreshToken });
            findUser.setDataValue("tokenId", createToken.getDataValue("tokenId"));
            yield findUser.save();
        }
        yield findUser.reload({ include: token_model_1.default });
        res
            .status(200)
            .json({ success: true, message: "Login successfully", data: findUser });
    }
    catch (error) {
        next(error);
    }
});
exports.default = login;
