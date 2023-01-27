import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Token from "../../../models/token.model";
import User from "../../../models/user.model";
import {
  generateAccessToken,
  generateToken,
} from "../../../utils/generateToken.util";

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token } = req.USER;
    console.log(token);
    const findToken = await Token.findOne({ where: { accessToken: token } });
    jwt.verify(
      findToken?.getDataValue("refreshToken") as string,
      process.env.REFRESHTOKENSECRET as string,
      async (error, _decoded): Promise<any> => {
        const user = await User.findOne({
          attributes: ["id", "role", "tokenId"],
          where: { tokenId: findToken?.getDataValue("tokenId") },
        });
        if (!user)
          return res
            .status(400)
            .json({ success: false, error: { message: "user not found" } });
        if (error) {
          const { accessToken, refreshToken } = await generateToken(
            user.getDataValue("id") as string,
            user.getDataValue("role") as unknown as string
          );
          await Token.update(
            { accessToken, refreshToken },
            { where: { tokenId: user.getDataValue("tokenId") } }
          );
          return res.status(200).json({ success: true, data: { accessToken } });
        }
        const { accessToken } = await generateAccessToken(
          user.getDataValue("id") as string,
          user.getDataValue("role") as unknown as string
        );
        await Token.update(
          { accessToken },
          { where: { tokenId: user.getDataValue("tokenId") } }
        );
        return res.status(200).json({ success: true, data: { accessToken } });
      }
    );
  } catch (error) {
    next(error);
  }
};

export default refreshToken;
