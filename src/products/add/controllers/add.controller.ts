import { Request, Response, NextFunction } from "express";
import Product from "@model/product.model";
import Store from "@model/store.model";
import Image from "@model/image.model";
import cloud from "@config/cloud.config";
import { Op } from "sequelize";
import hashids from "hashids";

const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { nameProduct, price, discount = 0, stoke, category, detail, image } = req.body;
  const { userId } = req.USER;
  const { idStore } = req.params;
  const hash = new hashids(process.env.SALTHASHIDS as string, 16);
  try {
    const findUserInStores = await Store.findOne({
      where: {
        [Op.and]: {
          idStore,
          access: {
            [Op.like]: `%${userId}%`,
          },
        },
      },
      attributes: ["idStore"],
    });
    if (!findUserInStores) return res.status(400).json({ success: false, error: { message: "-______-" } });
    const pid = hash.encodeHex(String(hash.decode(findUserInStores.getDataValue("idStore") as string)));
    const { secure_url, public_id } = await cloud.uploader.upload(image?.path as string, { folder: pid });
    await Image.create({
      idCloud: public_id,
      secure_url: secure_url,
    })
      .then(async (x: any) => {
        await Product.create({
          idStore,
          nameProduct,
          price,
          discount,
          stoke,
          category,
          detail,
          idImage: x.getDataValue("idImage") as string,
        });
      })
      .catch(async error => {
        await cloud.uploader.destroy(public_id);
        throw new Error(error);
      });
    // await cloud.api.delete_all_resources({ tag: pid });
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    next(error);
  }
};

export default addProduct;
