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
exports.checkExpiredToken = exports.verifyTokenAdmin = exports.verifyTokenAndAuthorization = exports.verifyToken = void 0;
const token_model_1 = __importDefault(require("../models/token.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const findTokenInDatabase = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield token_model_1.default.findOne({ where: { accessToken: token } })) === null
        ? false
        : true;
});
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader)
            return res
                .status(401)
                .json({ success: false, error: { message: "token required" } });
        const token = authHeader.split(" ")[1];
        const findToken = yield findTokenInDatabase(token);
        if (!findToken)
            return res
                .status(403)
                .json({ success: false, error: { message: "token invalid" } });
        jsonwebtoken_1.default.verify(token, process.env.ACCESSTOKENSECRET, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                return res
                    .status(403)
                    .json({ status: false, error: { message: "token expired" } });
            req.USER = decoded;
            next();
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.verifyToken = verifyToken;
const verifyTokenAndAuthorization = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            const { id, role } = req.USER;
            if (role === "admin" || id === req.params.id)
                return next();
            res.status(400).json({
                success: false,
                message: "You are not alowed to do that",
            });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyTokenAndAuthorization = verifyTokenAndAuthorization;
const verifyTokenAdmin = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            const { role } = req.USER;
            if (role === "admin")
                return next();
            res.status(400).json({
                success: false,
                message: "You are not alowed to do that",
            });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyTokenAdmin = verifyTokenAdmin;
const checkExpiredToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader)
            return res
                .status(401)
                .json({ success: false, error: { message: "token required" } });
        const token = authHeader.split(" ")[1];
        const findToken = yield findTokenInDatabase(token);
        if (!findToken)
            return res
                .status(403)
                .json({ success: false, error: { message: "token invalid" } });
        jsonwebtoken_1.default.verify(token, process.env.ACCESSTOKENSECRET, (error, _decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (!error)
                return res.status(400).json({
                    success: false,
                    error: { message: "Your token has not expired" },
                });
            req.USER = { token };
            next();
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.checkExpiredToken = checkExpiredToken;
