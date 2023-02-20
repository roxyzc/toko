import { Request, Response, NextFunction } from "express";
import CryptoJS from "crypto-js";
import Store from "@model/store.model";
import Image from "@model/image.model";

const getStore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { idStore } = req.params;
  try {
    const store = await Store.findOne({
      where: { idStore },
      attributes: ["nameStore", "tax", "income", "discount"],
      include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
    });
    if (!store) return res.status(404).json({ success: false, error: { message: "Store not found" } });
    const data = CryptoJS.AES.encrypt(JSON.stringify(store), process.env.SALTHASHIDS as string).toString();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export default getStore;
