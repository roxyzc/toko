import { Request, Response, NextFunction } from "express";
import { checkAccessUserInStore } from "@service/store.service";
import Store from "@model/store.model";
import Image from "@model/image.model";
import cloud from "@config/cloud.config";

const updateStore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { idStore } = req.params;
  const { userId } = req.USER;
  const { nameStore, tax, income, image } = req.body;
  try {
    if (!(await checkAccessUserInStore(userId, idStore as string)))
      return res.status(400).json({ success: false, error: { message: "error" } });

    if (image !== undefined) {
      await Store.findOne({
        where: {
          idStore,
        },
        attributes: ["idImage"],
        include: [{ model: Image, as: "image", attributes: ["idCloud"] }],
      }).then(async value => {
        const { secure_url, public_id } = await cloud.uploader.upload(image?.path as string, {
          public_id: value?.image.idCloud as string,
        });
        await Image.update(
          { secure_url, idCloud: public_id },
          {
            where: {
              idImage: value?.getDataValue("idImage") as string,
            },
          }
        );
      });
    }

    await Store.update(
      {
        nameStore,
        tax,
        income,
        updatedAt: Number(new Date().getTime()),
      },
      { where: { idStore } }
    );
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    next(error);
  }
};

export default updateStore;
