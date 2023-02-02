import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Store from "@model/store.model";
import { RSTORE } from "@tp/default";
import generateId from "@util/generateOtp.util";
import hashids from "hashids";

const createStore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { nameStore } = req.body;
  const { userId } = req.USER;
  const hash = new hashids(process.env.SALTHASHIDS as string, 16);
  try {
    const store = await Store.findAndCountAll({
      where: {
        access: {
          [Op.like]: `%${userId}%`,
        },
      },
      attributes: ["idStore", "nameStore"],
    });

    if (store.count === 3) return res.status(400).json({ success: false, error: { message: "maximum 3" } });

    let id: string = await generateId(4);
    let valid = true;
    while (valid) {
      const checkId = await Store.findOne({
        where: {
          idStore: hash.encode(id),
        },
      });
      if (!checkId) {
        valid = false;
      } else {
        id = await generateId(4);
      }
    }
    await Store.create({
      idStore: hash.encode(id),
      nameStore,
      access: JSON.stringify([{ userId, role: "owner" as unknown as RSTORE }]),
    });

    res.status(200).json({
      success: true,
      data: { message: "create store successfully" },
    });
  } catch (error) {
    next(error);
  }
};

const addAccess = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params;
  const { userId } = req.USER;
  try {
    const findUser = await Store.findAndCountAll({
      where: { access: { [Op.like]: `%${userId}%` } },
      attributes: ["idStore", "nameStore"],
    });
    if (findUser.count >= 3) return res.status(400).json({ success: false, error: { message: "maximum 3" } });

    const store = await Store.findOne({
      where: { idStore: id },
      attributes: ["idStore", "nameStore", "access"],
    });

    if (!store) return res.status(404).json({ success: false, error: { message: "store not found" } });
    const access: any[] = Array.from(JSON.parse(store.access));

    access.forEach((value: any) => {
      if (value.userId == userId) {
        throw new Error("user already exists");
      }
    });

    access.push(JSON.parse(JSON.stringify({ userId, role: "employee" as unknown as RSTORE })));
    await Store.update({ access: JSON.stringify(access) }, { where: { idStore: id } });

    res.status(200).json({ succes: true, data: { message: "success" } });
  } catch (error: any) {
    if (error.message == "user already exists") error.status = 409;
    next(error);
  }
};

export { createStore, addAccess };
