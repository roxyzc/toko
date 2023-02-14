import { Request, Response, NextFunction } from "express";
import Product from "@model/product.model";
import Image from "@model/image.model";
import cloud from "@config/cloud.config";
import { checkAccessUserInStore } from "@service/store.service";

const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { nameProduct, price, discount = 0, stoke, category, detail, image } = req.body;
  const { userId } = req.USER;
  const { idStore } = req.params;
  try {
    if (!(await checkAccessUserInStore(userId, idStore)))
      return res.status(400).json({ success: false, error: { message: "error" } });
    const { secure_url, public_id } = await cloud.uploader.upload(image?.path as string, {
      folder: `project/${idStore}`,
    });
    await Image.create({
      idCloud: public_id,
      secure_url: secure_url,
    })
      .then(async (x: any) => {
        await Product.create({
          idStore,
          nameProduct,
          price,
          discount,
          stoke,
          category: String(category).toLowerCase(),
          detail,
          idImage: x.getDataValue("idImage") as string,
        });
      })
      .catch(async error => {
        await cloud.uploader.destroy(public_id);
        throw new Error(error);
      });
    // await cloud.api
    //   .delete_resources_by_prefix(`project/${findUserInStores.getDataValue("idStore") as string}`)
    //   .then(async () => {
    //     await cloud.api.delete_folder(`project/${findUserInStores.getDataValue("idStore") as string}`);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     throw new Error(error);
    //   });
    res.status(200).json({ success: true, data: { message: "success" } });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default addProduct;
