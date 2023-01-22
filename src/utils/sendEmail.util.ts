import nodemailer from "nodemailer";

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

export const sendEmail = (email: string, otp: string): Promise<Boolean> => {
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
