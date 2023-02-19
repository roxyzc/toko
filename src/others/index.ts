import { Router } from "express";
import takeTheOtp from "./otp/controllers/takeTheOtp.controller";
import checkLimitBeforeTakeTheOtp from "./otp/controllers/checkLimit.controller";
import cekEmail from "./email/controllers/cekEmail.controller";
import { schema, validateSchema } from "../middlewares/verifySchemas.middleware";

const route: Router = Router();
route.post("/otp", validateSchema(schema.Other.otp), takeTheOtp);
route.post("/otp/limit", validateSchema(schema.Other.otp), checkLimitBeforeTakeTheOtp);
route.post("/cekEmail", validateSchema(schema.Other.cekEmail), cekEmail);
export default route;
