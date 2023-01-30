import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Store from "../../../models/store.model";
import { RSTORE } from "../../../types/default";
import generateId from "../../../utils/generateOtp.util";

const createStore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { nameStore } = req.body;
  const { userId } = req.USER;
  try {
    const store = await Store.findAndCountAll({
      where: {
        access: {
          [Op.like]: `%${userId}%`,
        },
      },
      attributes: ["idStore", "nameStore"],
    });

    if (store.count === 3)
      return res
        .status(400)
        .json({ success: false, error: { message: "maximum 3" } });

    let id = await generateId(4);
    let valid = true;
    while (valid) {
      const checkId = await Store.findOne({
        where: {
          idStore: id,
        },
      });
      if (!checkId) {
        valid = false;
      } else {
        id = await generateId(4);
      }
    }
    await Store.create({
      idStore: id,
      nameStore,
      access: JSON.stringify([{ userId, role: "owner" as unknown as RSTORE }]),
    });

    // cara update data
    // const coba = JSON.parse(store?.access);
    // Array.from(coba);
    // coba.push(JSON.parse(JSON.stringify({ userId })));

    // await Store.update(
    //   {
    //     access: JSON.stringify(coba),
    //   },
    //   { where: { nameStore } }
    // );
    // console.log(coba);
    res.status(200).json({
      success: true,
      data: { message: "create store successfully" },
    });
  } catch (error) {
    next(error);
  }
};

export default createStore;
