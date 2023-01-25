import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { logger } from "./logs/logger.log";
import { errorHandler, notFound } from "./middleware/errorHandlers.middleware";
import "dotenv/config";
import db from "./configs/database.config";
import routeAuth from "./auth/index";
import route from "./other/index";
import cekOtp from "./service/otp.service";
import cekUser from "./service/user.service";

db.sync({ alter: true, force: false })
  .then(() => {
    logger.info("Connection to database successfully");
  })
  .catch((error) => {
    console.log(error);
    logger.error("Connection to database failed");
    process.exit(1);
  });

const app: Application = express();

if (process.env.NODE_ENV) app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

cekOtp;
cekUser;

app.use("/api/auth", routeAuth);
app.use("/api", route);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT as string, () => {
  logger.info(`Listen at port ${process.env.PORT} (${process.env.NODE_ENV})`);
});
