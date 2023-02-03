import { Router } from "express";
import { schema, validateSchema } from "../middlewares/verifySchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { accept, add } from "./collaboration/controllers/collaboration.controller";
import createStore from "./create/controllers/create.controller";
import getStores from "./getListStore/controllers/getListStore.controller";

const route: Router = Router();

route.post("/store/create", verifyToken, validateSchema(schema.store.create), createStore);
route.post("/store/add/:id", verifyToken, validateSchema(schema.store.addC), add);
route.put("/store/accept/:id", verifyToken, accept);

route.get("/stores", verifyToken, getStores);

export default route;
