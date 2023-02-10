import jwt from "jsonwebtoken";

const generateToken = (userId: string, email: string, nama: string, role: string) => {
  const accessToken = jwt.sign({ userId, email, nama, role }, process.env.ACCESSTOKENSECRET as string, {
    expiresIn: 900,
  });
  const refreshToken = jwt.sign({ userId, email, nama, role }, process.env.REFRESHTOKENSECRET as string, {
    expiresIn: 1800,
  });
  return Promise.resolve({ accessToken, refreshToken });
};

const generateAccessToken = (userId: string, email: string, nama: string, role: string) => {
  const accessToken = jwt.sign({ userId, email, nama, role }, process.env.ACCESSTOKENSECRET as string, {
    expiresIn: 900,
  });

  return Promise.resolve({ accessToken });
};

export { generateToken, generateAccessToken };
