import jwt from "jsonwebtoken";

const generateToken = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, process.env.ACCESSTOKENSECRET as string, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId, role }, process.env.REFRESHTOKENSECRET as string, { expiresIn: "30m" });
  return Promise.resolve({ accessToken, refreshToken });
};

const generateAccessToken = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, process.env.ACCESSTOKENSECRET as string, { expiresIn: "15m" });

  return Promise.resolve({ accessToken });
};

export { generateToken, generateAccessToken };
