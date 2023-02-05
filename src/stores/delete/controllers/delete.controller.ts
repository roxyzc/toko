import { Request, Response, NextFunction } from "express";
import Store from "@model/store.model";

const deleteStore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { idStore } = req.params;
  const { userId } = req.USER;
  try {
    const findStore = await Store.findOne({ where: { idStore } });
    if (!findStore) return res.status(404).json({ success: false, error: { message: "store not found" } });
    const access = Array.from(JSON.parse(findStore.access)).filter(
      (x: any, _v) => x.userId == userId && x.role == "owner"
    );
    if (!access) return res.status(403).json({ success: false, error: { message: "You are not alowed to do that" } });
    const store = await Store.destroy({ where: { idStore } });
    res.status(200).json({ success: true, data: { message: "success", store } });
  } catch (error) {
    next(error);
  }
};

export default deleteStore;
