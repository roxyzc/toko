import { Router } from "express";
import { query, validateQuery } from "middlewares/verifyQuery.middleware";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
import { verifyToken } from "middlewares/verifyToken.middleware";
import add from "./add/controllers/add.controller";
import check from "./get/controllers/checkUpdate.controller";
import get from "./get/controllers/get.controller";

const route: Router = Router();

route
  .route("/cart")
  .get(verifyToken, get)
  .post(verifyToken, validateQuery(query.cart.add), validateSchema(schema.Cart.add), add);

route.get("/cart/checkUpdate", verifyToken, check);

export default route;
