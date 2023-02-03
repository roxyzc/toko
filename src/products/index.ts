import { Router } from "express";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
import { verifyToken } from "middlewares/verifyToken.middleware";
import addProduct from "./add/controllers/add.controller";
const route: Router = Router();

route.post("/:idStore", verifyToken, validateSchema(schema.Product.add), addProduct);

export default route;
