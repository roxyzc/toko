import { Router } from "express";
import { query, validateQuery } from "middlewares/verifyQuery.middleware";
import { verifyToken } from "middlewares/verifyToken.middleware";
import add from "./add/controllers/add.controller";

const route: Router = Router();

route.post("/cart", verifyToken, validateQuery(query.cart.add), add);

export default route;
