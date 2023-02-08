import { Router } from "express";
import verifyFile from "middlewares/verifyFile.middleware";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
import { verifyToken } from "middlewares/verifyToken.middleware";
import addProduct from "./add/controllers/add.controller";
const route: Router = Router();

route.post("/:idStore", verifyToken, verifyFile, validateSchema(schema.Product.add), addProduct);

export default route;
