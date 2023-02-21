import { Router } from "express";
import { query, validateQuery } from "middlewares/verifyQuery.middleware";
import { schema, validateSchema } from "middlewares/verifySchemas.middleware";
import { verifyToken } from "middlewares/verifyToken.middleware";
import add from "./add/controllers/add.controller";
import deleteCart from "./delete/controllers/delete.controller";
import get from "./get/controllers/get.controller";
import update from "./update/controllers/update.controller";

const route: Router = Router();

route
  .route("/cart")
  .get(verifyToken, get)
  .post(verifyToken, validateQuery(query.cart.addUpdateAndDelete), validateSchema(schema.Cart.addAndUpdate), add)
  .put(verifyToken, validateQuery(query.cart.addUpdateAndDelete), validateSchema(schema.Cart.addAndUpdate), update)
  .delete(verifyToken, validateQuery(query.cart.addUpdateAndDelete), deleteCart);

export default route;
