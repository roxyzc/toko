import Image from "@model/image.model";
import Product from "@model/product.model";
import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  let limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);
  let page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);
  let search = req.query.search === undefined || req.query.search === "" ? "" : req.query.search;
  let start = (page - 1) * limit;
  let end = page * limit;
  try {
    const products = await Product.findAndCountAll({
      where: {
        idStore: req.params.idStore,
        nameProduct: { [Op.like]: `%${search}%` },
      },
      attributes: [
        "idProduct",
        "nameProduct",
        "price",
        "discount",
        "stoke",
        "detail",
        "category",
        "createdAt",
        "updatedAt",
      ],
      order: [["updatedAt", "DESC"]],
      include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
      limit: limit,
      offset: start,
    });
    let count = products.count;
    let pagination = {};
    Object.assign(pagination, { totalRow: products.count, totalPage: Math.ceil(count / limit) });
    if (end < count) {
      Object.assign(pagination, { next: { page: page + 1, limit } });
    }
    if (start > 0) {
      Object.assign(pagination, { prev: { page: page - 1, limit } });
    }
    res.status(200).json({ success: true, pagination, data: products.rows });
  } catch (error) {
    next(error);
  }
};

export default getProducts;
