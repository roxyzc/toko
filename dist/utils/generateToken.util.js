"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, email, nama, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, email, nama, role }, process.env.ACCESSTOKENSECRET, {
        expiresIn: 900,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, email, nama, role }, process.env.REFRESHTOKENSECRET, {
        expiresIn: 1800,
    });
    return Promise.resolve({ accessToken, refreshToken });
};
exports.generateToken = generateToken;
const generateAccessToken = (userId, email, nama, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, email, nama, role }, process.env.ACCESSTOKENSECRET, {
        expiresIn: 900,
    });
    return Promise.resolve({ accessToken });
};
exports.generateAccessToken = generateAccessToken;
