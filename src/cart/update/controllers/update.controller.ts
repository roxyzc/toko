import { Request, Response, NextFunction } from "express";
import Cart from "@model/cart.model";
import Product from "@model/product.model";

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { is, ip } = req.query;
  const { userId } = req.USER;
  const { count } = req.body;
  try {
    await Cart.findOne({
      where: {
        idStore: is as string,
        idProduct: ip as string,
        userId,
      },
      attributes: ["count", "price", "totalPrice"],
      include: [{ model: Product, as: "product", attributes: ["nameProduct", "stock"] }],
    })
      .then(async value => {
        if (count > value?.product.stock) {
          res.status(400).json({ success: false, error: { message: `remaining stock ${value?.product?.stock}` } });
        } else {
          await Cart.update(
            {
              count,
              totalPrice: count * Number(value?.getDataValue("price")),
              updatedAt: Number(new Date().getTime()),
            },
            {
              where: {
                idStore: is as string,
                idProduct: ip as string,
                userId,
              },
            }
          );
          res.status(200).json({ success: true, data: { message: "success" } });
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  } catch (error) {
    next(error);
  }
};

export default update;
