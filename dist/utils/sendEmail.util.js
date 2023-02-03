"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailForCollaboration = exports.sendEmailAfterVerification = exports.sendEmail = void 0;
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
const sendEmailAfterVerification = (email, nama) => {
    let mailOptions = {
        from: `"email verification successful"<${process.env.USER}>`,
        to: email,
        subject: "Success",
        html: `
        <center>
        <h3>halo ${nama} akun anda telah terdaftar di AKBAROXYZC</h3>
        </center>
        `,
    };
    try {
        transporter().sendMail(mailOptions);
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.resolve(false);
    }
};
exports.sendEmailAfterVerification = sendEmailAfterVerification;
const sendEmailForCollaboration = (req, email, nama, nameStore, idStore) => {
    let mailOptions = {
        from: `"Verification for collaboration"<${process.env.USER}>`,
        to: email,
        subject: "Collaboration",
        html: `
        <center>
        <h3>halo ${nama} anda diajak collaboration di ${nameStore}</h3>
        <a href="http://${req.headers.host}/api/store/accept/${idStore}">klik disini untuk menerima</a>
        </center>
        `,
    };
    try {
        transporter().sendMail(mailOptions);
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.resolve(false);
    }
};
exports.sendEmailForCollaboration = sendEmailForCollaboration;
