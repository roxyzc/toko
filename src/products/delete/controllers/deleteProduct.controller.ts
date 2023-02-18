import { Request, Response, NextFunction } from "express";
import Product from "@model/product.model";
import Image from "@model/image.model";
import cloud from "@config/cloud.config";
import db from "@config/database.config";
import { checkAccessUserInStore } from "@service/store.service";

const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { is, ip } = req.query;
  const { userId } = req.USER;
  const t = await db.transaction();
  try {
    if (!(await checkAccessUserInStore(userId, is as string)))
      return res.status(400).json({ success: false, error: { message: "error" } });
    const product = await Product.findOne({
      where: {
        idStore: is as string,
        idProduct: ip as string,
      },
      include: [{ model: Image, as: "image", attributes: ["idCloud"] }],
    });
    if (!product) return res.status(404).json({ success: false, error: { message: "product not found" } });
    await Image.destroy({
      where: {
        idImage: product.getDataValue("idImage"),
      },
      transaction: t,
    })
      .then(async () => {
        await Product.destroy({
          where: {
            idStore: is as string,
            idProduct: ip as string,
          },
          transaction: t,
        });
      })
      .catch(error => {
        t.rollback();
        throw new Error(error);
      });

    await cloud.uploader.destroy(product.image.idCloud).catch(error => {
      t.rollback();
      throw new Error(error);
    });
    t.commit();
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    next(error);
  }
};

export default deleteProduct;
