import { Request, Response, NextFunction } from "express";
import Store from "@model/store.model";
import { Op } from "sequelize";
import Image from "@model/image.model";
import CryptoJS from "crypto-js";

const getStores = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId } = req.USER;
  try {
    const stores = await Store.findAll({
      where: { access: { [Op.like]: `%${userId}%` } },
      attributes: ["idStore", "nameStore", "access"],
      include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
    });

    let data: any[] = [];
    stores.forEach((x, _i) => {
      const coba: any[] = Array.from(JSON.parse(x.access));
      const filter = coba.filter((v, _i) => v.userId === userId);
      data.push({
        idStore: x.getDataValue("idStore"),
        nameStore: x.getDataValue("nameStore"),
        role: filter[0].role,
        image: x.image?.secure_url,
      });
    });

    if (data.length === 0)
      return res.status(202).json({ success: true, data: { message: "The user doesn't have a store yet" } });

    const encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SALTHASHIDS as string).toString();
    res.status(200).json({
      success: true,
      data: encrypt,
      // decrypt: JSON.parse(
      //   CryptoJS.AES.decrypt(encrypt, process.env.SALTHASHIDS as string).toString(CryptoJS.enc.Utf8)
      // ),
    });
  } catch (error) {
    next(error);
  }
};

export default getStores;
