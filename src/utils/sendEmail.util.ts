import nodemailer from "nodemailer";
import { Request } from "express";
// import User from "@model/user.model";
// import Store from "@model/store.model";

const transporter = () => {
  return nodemailer.createTransport({
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

const sendEmail = (email: string, otp: string): Promise<Boolean> => {
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
  } catch (error: any) {
    return Promise.resolve(false);
  }
};

const sendEmailAfterVerification = (email: string, nama: string) => {
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
  } catch (error: any) {
    return Promise.resolve(false);
  }
};

const sendEmailForCollaboration = (req: Request, email: string, nama: string, nameStore: string, idStore: string) => {
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
  } catch (error: any) {
    return Promise.resolve(false);
  }
};

export { sendEmail, sendEmailAfterVerification, sendEmailForCollaboration };
