"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const generateOTP = (num) => {
    let len = num !== null && num !== void 0 ? num : 6;
    let str = "";
    const digits = "0123456789";
    for (let i = 0; i < Number(len); i++) {
        str += digits[Math.floor(Math.random() * 10)];
    }
    return str;
};
exports.generateOTP = generateOTP;
