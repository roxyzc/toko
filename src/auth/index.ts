import { Router } from "express";
import routeRegister from "./register/controllers/register.controller";

const route: Router = Router();

route.post("/register", routeRegister);

export default route;
