import { Request, Response, NextFunction } from "express";
import Product from "@model/product.model";

const getCatagoryProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { idStore } = req.params;
  try {
    const products = await Product.findAll({ where: { idStore }, attributes: ["category"] });
    let data: any[] = [];
    products.forEach(async value => {
      const cek = data.findIndex(obj => obj.category === value.getDataValue("category"));
      if (cek === -1) {
        data.push({ category: value.getDataValue("category"), count: 1 });
      } else {
        data[cek].count += 1;
      }
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export default getCatagoryProducts;
