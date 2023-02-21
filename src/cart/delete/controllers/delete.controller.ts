import { Request, Response, NextFunction } from "express";
import Cart from "@model/cart.model";

const deleteCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { is, ip } = req.query;
  const { userId } = req.USER;
  try {
    const cart = await Cart.destroy({
      where: {
        idStore: is as string,
        idProduct: ip as string,
        userId,
      },
    });
    if (!cart) {
      return res.status(404).json({ success: false, error: { message: "cart not found" } });
    }
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    next(error);
  }
};

export default deleteCart;
