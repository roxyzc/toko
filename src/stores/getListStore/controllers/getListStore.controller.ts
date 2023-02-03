import { Request, Response, NextFunction } from "express";
import Store from "@model/store.model";
import { Op } from "sequelize";

const getStores = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId } = req.USER;
  try {
    const stores = await Store.findAll({
      where: { access: { [Op.like]: `%${userId}%` } },
      attributes: ["idStore", "nameStore", "access"],
    });

    let data: any[] = [];
    stores.forEach((x, _i) => {
      const coba: any[] = Array.from(JSON.parse(x.access));
      const filter = coba.filter((v, _i) => v.userId === userId);
      data.push({ idStore: x.getDataValue("idStore"), nameStore: x.getDataValue("nameStore"), role: filter[0].role });
    });

    if (data.length === 0)
      return res.status(202).json({ success: true, data: { message: "The user doesn't have a store yet" } });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export default getStores;
