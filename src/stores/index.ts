import { Router } from "express";
import {
  schema,
  validateSchema,
} from "../middlewares/verifySchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { addAccess, createStore } from "./create/controllers/create.controller";

const route: Router = Router();

route.post(
  "/create",
  verifyToken,
  validateSchema(schema.store.create),
  createStore
);

route.put("/add/:id", verifyToken, addAccess);

export default route;
