import { Router } from "express";
import routeRegister from "./register/controllers/register.controller";
import {
  schema,
  validateSchema,
} from "../middlewares/verifySchemas.middleware";
import login from "./login/controllers/login.controller";
import verifyAccount from "./verifyAccount/controllers/verifyAccount.controller";
import {
  checkExpiredToken,
  verifyToken,
} from "../middlewares/verifyToken.middleware";
import refreshToken from "./token/controllers/token.controller";
import logout from "./logout/controllers/logout.controller";

const route: Router = Router();

route.post("/register", validateSchema(schema.Auth.register), routeRegister);
route.post("/login", validateSchema(schema.Auth.login), login);
route.post(
  "/verifyAccount",
  validateSchema(schema.Auth.verifyOtp),
  verifyAccount
);
route.get("/refreshToken", checkExpiredToken, refreshToken);
route.delete("/logout", verifyToken, logout);

export default route;
