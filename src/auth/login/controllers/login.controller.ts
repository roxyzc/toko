import { Request, Response, NextFunction } from "express";
import Otp from "@model/otp.model";
import Token from "@model/token.model";
import User from "@model/user.model";
import { STATUS } from "@tp/default";
import { generateToken } from "@util/generateToken.util";

const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, password } = req.body;
  try {
    let findUser = await User.findOne({
      attributes: ["id", "nama", "email", "password", "status", "role", "tokenId", "expiredAt"],
      where: {
        email,
      },
    });
    if (!findUser) return res.status(400).json({ success: false, error: { message: "user not found" } });

    if (findUser.status !== ("active" as unknown as STATUS)) {
      if (Number(findUser.getDataValue("expiredAt")) < Number(new Date().getTime())) {
        await User.destroy({
          where: { email },
        });
        await Otp.destroy({ where: { email } });
        return res.status(410).json({
          success: false,
          error: { message: "Expired account please register again" },
        });
      }
      return res.status(403).json({
        success: false,
        error: { message: "the account has not been verified" },
      });
    }

    const valid = await findUser.comparePassword?.(password as string);
    if (!valid) return res.status(401).json({ success: false, error: { message: "password invalid" } });

    const { accessToken, refreshToken } = await generateToken(
      findUser.getDataValue("id"),
      findUser.getDataValue("email"),
      findUser.getDataValue("nama"),
      findUser.getDataValue("role") as unknown as string
    );

    if (findUser.tokenId === null || findUser.tokenId === undefined) {
      const createToken = await Token.create({ accessToken, refreshToken });
      findUser.setDataValue("tokenId", createToken.getDataValue("tokenId"));
      await findUser.save();
    }

    findUser = await User.findOne({
      where: { email },
      attributes: ["nama", "email"],
      include: [{ model: Token, as: "token", attributes: ["accessToken"] }],
    });

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: findUser,
    });
  } catch (error) {
    next(error);
  }
};

export default login;
