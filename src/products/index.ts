import { Router } from "express";
import verifyFile from "middlewares/verifyFile.middleware";
import { validateQuery, query } from "middlewares/verifyQuery.middleware";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
import { verifyToken } from "middlewares/verifyToken.middleware";
import addProduct from "./add/controllers/add.controller";
import getProducts from "./get/controllers/getProduct.controller";
const route: Router = Router();

route.post("/:idStore", verifyToken, verifyFile, validateSchema(schema.Product.add), addProduct);
route.get("/:idStore", verifyToken, validateQuery(query.product.get), getProducts);

export default route;
