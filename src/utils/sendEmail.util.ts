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

export const sendEmailAfterVerification = (email: string, nama: string) => {
  let mailOptions = {
    from: `"email verification successful"<${process.env.USER}>`,
    to: email,
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
