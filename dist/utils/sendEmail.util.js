"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = () => {
    return nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
};
const sendEmail = (email, otp) => {
    let mailOptions = {
        from: `"Verify your email"<${process.env.USER}>`,
        to: email,
        subject: "-OTP-",
        html: `
        <p>your otp <b>${otp}</b></p>`,
    };
    try {
        transporter().sendMail(mailOptions);
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.resolve(false);
    }
};
exports.sendEmail = sendEmail;
