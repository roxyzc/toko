import { Request, Response, NextFunction } from "express";
import Product from "@model/product.model";
import Store from "@model/store.model";

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { nameProduct, price } = req.body;
  const { idStore } = req.params;
  try {
    const product = await Product.create({
      idStore,
      nameProduct,
      price,
    });
    product.reload({ include: [{ model: Store, as: "store", attributes: ["nameStore", "idStore"] }] });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export default addProduct;
