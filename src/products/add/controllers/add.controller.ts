import { Request, Response, NextFunction } from "express";
import Product from "@model/product.model";
import Store from "@model/store.model";
import { Op } from "sequelize";

const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { nameProduct, price } = req.body;
  const { userId } = req.USER;
  const { idStore } = req.params;
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

    const product = await Product.create(
      {
        idStore,
        nameProduct,
        price,
      },
      { raw: true }
    );
    await product.reload({
      include: [{ model: Store, as: "store", attributes: ["nameStore"] }],
    });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export default addProduct;
