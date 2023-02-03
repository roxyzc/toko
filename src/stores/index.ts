import { Router } from "express";
import { schema, validateSchema } from "../middlewares/verifySchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import collaboration from "./collaboration/controllers/collaboration.controller";
import createStore from "./create/controllers/create.controller";
import getStores from "./getListStore/controllers/getListStore.controller";

const route: Router = Router();

route.post("/store/create", verifyToken, validateSchema(schema.store.create), createStore);

route.put("/store/add/:id", verifyToken, collaboration);

route.get("/stores", verifyToken, getStores);

export default route;
