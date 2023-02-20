import { Request, Response, NextFunction } from "express";
import Cart from "@model/cart.model";
import Image from "@model/image.model";
import Product from "@model/product.model";

const get = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);
  let page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);
  let start = (page - 1) * limit;
  let end = page * limit;
  const { userId } = req.USER;
  try {
    const cart = await Cart.findAndCountAll({
      where: { userId },
      attributes: ["count", "price", "totalPrice"],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["nameProduct"],
          include: [{ model: Image, as: "image", attributes: ["secure_url"] }],
        },
      ],
      order: [["updatedAt", "ASC"]],
      limit: limit,
      offset: start,
    });
    let count = cart.count;
    let pagination = {};
    Object.assign(pagination, { totalRow: cart.count, totalPage: Math.ceil(count / limit) });
    if (end < count) {
      Object.assign(pagination, { next: { page: page + 1, limit, remaining: count - (start + limit) } });
    }
    if (start > 0) {
      Object.assign(pagination, { prev: { page: page - 1, limit, remaining: count - (count - start) } });
    }
    if (page > Math.ceil(count / limit)) {
      Object.assign(pagination, { prev: { Premaining: count } });
    }
    res.status(200).json({ success: true, pagination, data: cart });
  } catch (error) {
    next(error);
  }
};

export default get;
