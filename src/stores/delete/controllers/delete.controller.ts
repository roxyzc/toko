import { Request, Response, NextFunction } from "express";
import Store from "@model/store.model";
import Product from "@model/product.model";
import cloud from "@config/cloud.config";
import Image from "@model/image.model";
import db from "@config/database.config";
import { Op } from "sequelize";
import { checkAccessUserInStoreAsOwner } from "@service/store.service";

const deleteStore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { idStore } = req.params;
  const { userId } = req.USER;
  const t = await db.transaction();
  try {
    // const findStore = await Store.findOne({ where: { idStore } });
    // if (!findStore) return res.status(404).json({ success: false, error: { message: "store not found" } });
    // const access = Array.from(JSON.parse(findStore.access)).filter(
    //   (x: any, _v) => x.userId == userId && x.role == "owner"
    // );
    if (!(await checkAccessUserInStoreAsOwner(userId, idStore as string)))
      return res.status(403).json({ success: false, error: { message: "You are not alowed to do that" } });

    await Store.destroy({ where: { idStore }, transaction: t })
      .then(async () => {
        await Product.destroy({
          where: {
            idStore,
          },
          transaction: t,
        });
      })
      .then(async () => {
        await Image.destroy({
          where: {
            idCloud: {
              [Op.like]: `%project/${idStore}%`,
            },
          },
          transaction: t,
        });
      })
      .catch(error => {
        t.rollback();
        throw new Error(error);
      });

    await cloud.api.delete_resources_by_prefix(`project/${idStore}`).catch(() => {
      t.rollback();
      throw new Error("error");
    });

    t.commit();
  } catch (error) {
    return next(error);
  }

  try {
    await cloud.api.delete_folder(`project/${idStore}`);
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    return next(error);
  }
};

export default deleteStore;
