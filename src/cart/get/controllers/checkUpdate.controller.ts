import { Request, Response, NextFunction } from "express";
import Cart from "@model/cart.model";
import Product from "@model/product.model";
import Store from "@model/store.model";

const check = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.USER;
  try {
    await Cart.findAll({ where: { userId }, attributes: ["count", "idStore", "idProduct"] }).then(value => {
      value.forEach(async (value: any) => {
        const product = await Product.findOne({
          where: {
            idStore: value?.idStore,
            idProduct: value?.idProduct,
          },
          attributes: ["discount", "price"],
          include: [{ model: Store, as: "store", attributes: ["discount"] }],
        });
        if (!product) {
          await Cart.destroy({
            where: {
              idStore: value?.idStore,
              idProduct: value?.idProduct,
              userId,
            },
          });
          return;
        }

        let price =
          Number(product?.getDataValue("discount")) == 0
            ? Number(product?.getDataValue("price"))
            : Number(product?.getDataValue("price")) -
              Number(product?.getDataValue("price")) * (Number(product?.getDataValue("discount")) / 100);

        price = Number(product.store?.discount) == 0 ? price : price - price * (Number(product.store?.discount) / 100);

        await Cart.update(
          {
            price,
            totalPrice: value?.count * Number(price),
          },
          {
            where: {
              idStore: value?.idStore,
              idProduct: value?.idProduct,
              userId,
            },
          }
        );
      });
    });
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    next(error);
  }
};

export default check;
