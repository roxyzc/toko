import { Router } from "express";
import verifyFile from "middlewares/verifyFile.middleware";
import { validateQuery, query } from "middlewares/verifyQuery.middleware";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
import { verifyToken } from "middlewares/verifyToken.middleware";
import addProduct from "./add/controllers/add.controller";
import deleteProduct from "./delete/controllers/deleteProduct.controller";
import getCatagoryProducts from "./get/controllers/getCatagoryProducts";
import getProducts from "./get/controllers/getProduct.controller";
import updateProduct from "./update/controllers/updateProduct.controller";
const route: Router = Router();

route.post("/:idStore", verifyToken, verifyFile, validateSchema(schema.Product.add), addProduct);
route.get("/:idStore", verifyToken, validateQuery(query.product.get), getProducts);
route.get("/category/:idStore", verifyToken, getCatagoryProducts);
route.delete("/", verifyToken, validateQuery(query.product.deleteAndUpdate), deleteProduct);
route.put(
  "/",
  verifyToken,
  validateQuery(query.product.deleteAndUpdate),
  verifyFile,
  validateSchema(schema.Product.update),
  updateProduct
);

export default route;
