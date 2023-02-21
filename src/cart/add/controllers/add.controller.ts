import { NextFunction, Request, Response } from "express";
import Cart from "@model/cart.model";
import Product from "@model/product.model";
import { Op } from "sequelize";
import Store from "@model/store.model";
import Image from "@model/image.model";

const add = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { is, ip } = req.query;
  const { userId } = req.USER;
  const { count = 1 } = req.body;
  try {
    const product = await Product.findOne({
      where: {
        [Op.and]: [
          {
            idStore: is as string,
            idProduct: ip as string,
          },
          {
            stock: {
              [Op.gt]: 0,
            },
          },
        ],
      },
      attributes: ["stock", "discount", "price"],
      include: [{ model: Store, as: "store", attributes: ["discount"] }],
    });
    if (!product) return res.status(404).json({ success: false, error: { message: "Product not found" } });
    if (count > product.getDataValue("stock"))
      return res
        .status(400)
        .json({ success: false, error: { message: `remaining stock ${product.getDataValue("stock")}` } });
    let price: Number =
      product.getDataValue("discount") != 0
        ? Number(product.getDataValue("price")) * (Number(product.getDataValue("discount")) / 100)
        : product.getDataValue("price");

    price =
      product.store?.discount == 0 ? price : Number(price) - Number(price) * (Number(product.store?.discount) / 100);
    await Cart.create({
      userId,
      idProduct: ip as string,
      idStore: is as string,
      count,
      price,
      totalPrice: Number(price) * count,
    })
      .then(async value => {
        const cart = await Cart.findOne({
          where: { idCart: value.getDataValue("idCart") },
          attributes: ["count", "price", "totalPrice"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["nameProduct"],
              include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
            },
          ],
        });
        res.status(200).json({ success: true, data: { cart } });
      })
      .catch(error => {
        throw new Error(error);
      });
  } catch (error) {
    next(error);
  }
};

export default add;
