import { Router } from "express";
import { schema, validateSchema } from "../middlewares/verifySchemas.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { accept, add } from "./collaboration/controllers/collaboration.controller";
import createStore from "./create/controllers/create.controller";
import deleteStore from "./delete/controllers/delete.controller";
import getStores from "./getListStore/controllers/getListStore.controller";

const route: Router = Router();

route.post("/store/create", verifyToken, validateSchema(schema.store.create), createStore);
route.post("/store/add/:idStore", verifyToken, validateSchema(schema.store.addC), add);
route.put("/store/accept/:idStore", verifyToken, accept);
route.delete("/store/:idStore", verifyToken, deleteStore);
route.get("/stores", verifyToken, getStores);

export default route;
