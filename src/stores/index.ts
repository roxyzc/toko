import { Router } from "express";
import {
  schema,
  validateSchema,
} from "../middlewares/verifySchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import createStore from "./create/controllers/create.controller";

const route: Router = Router();

route.post(
  "/create",
  verifyToken,
  validateSchema(schema.store.create),
  createStore
);

export default route;
