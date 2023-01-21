import { NextFunction, Request, Response } from "express";
import ShortUniqueId from "short-unique-id";
import { logger } from "../../../logs/logger.log";
// import { logger } from "../../../logs/logger.log";
import User from "../../../models/user.model";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { nama, email, password } = req.body;

  try {
    let id = new ShortUniqueId().randomUUID(8);
    let cekId = true;
    while (cekId) {
      const findUser = await User.findOne({
        where: {
          id,
        },
      });
      if (!findUser) {
        cekId = false;
      } else {
        id = new ShortUniqueId().randomUUID(8);
      }
    }

    const user = await User.create({
      id,
      nama: nama as string,
      email: email as string,
      password: password as string,
    });
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
};

export default register;
