import { Request, Response, NextFunction } from "express";
import Product from "@model/product.model";
import Image from "@model/image.model";
import cloud from "@config/cloud.config";
import { checkAccessUserInStore } from "@service/store.service";

const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { is, ip } = req.query;
  const { nameProduct, stoke, price, discount, category, detail, image } = req.body;
  const { userId } = req.USER;
  try {
    if (!(await checkAccessUserInStore(userId, is as string)))
      return res.status(400).json({ success: false, error: { message: "error" } });
    if (image !== undefined) {
      await Product.findOne({
        where: {
          idStore: is as string,
          idProduct: ip as string,
        },
        attributes: ["idImage"],
        include: [{ model: Image, as: "image", attributes: ["idCloud"] }],
      }).then(async value => {
        const { secure_url, public_id } = await cloud.uploader.upload(image?.path as string, {
          public_id: value?.image.idCloud as string,
        });
        await Image.update({ secure_url, idCloud: public_id }, { where: { idImage: value?.getDataValue("idImage") } });
      });
    }
    await Product.update(
      {
        nameProduct,
        stoke,
        price,
        discount,
        category,
        detail,
        updatedAt: Number(new Date().getTime()),
      },
      {
        where: {
          idStore: is as string,
          idProduct: ip as string,
        },
      }
    );
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    next(error);
  }
};

export default updateProduct;
