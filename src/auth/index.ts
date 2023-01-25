import { Router } from "express";
import routeRegister from "./register/controllers/register.controller";
import { schema, validateSchema } from "../middleware/verifySchemas.middleware";
import login from "./login/controllers/login.controller";
import verifyAccount from "./verifyAccount/controllers/verifyAccount.controller";
import { checkExpiredToken } from "../middleware/verifyToken.middleware";
import refreshToken from "./token/controllers/token.controller";

const route: Router = Router();

route.post("/register", validateSchema(schema.Auth.register), routeRegister);
route.post("/login", validateSchema(schema.Auth.login), login);
route.post(
  "/verifyAccount",
  validateSchema(schema.Auth.verifyOtp),
  verifyAccount
);
route.get("/refreshToken", checkExpiredToken, refreshToken);

export default route;
