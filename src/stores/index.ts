import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import createStore from "./create/controllers/create.controller";

const route: Router = Router();

route.post("/create", verifyToken, createStore);

export default route;
