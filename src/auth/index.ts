import { Router } from "express";
import routeRegister from "./register/controllers/register.controller";
import { schema, validateSchema } from "../middleware/verifySchemas.middleware";
import login from "./login/controllers/login.controller";

const route: Router = Router();

route.post("/register", validateSchema(schema.Auth.register), routeRegister);
route.post("/login", validateSchema(schema.Auth.login), login);

export default route;
