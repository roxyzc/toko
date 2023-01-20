import express, { Application } from "express";
import { logger } from "./logs/logger.log";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

const app: Application = express();

if (process.env.NODE_ENV) app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.listen(process.env.PORT as string, () => {
  logger.info(`Listen at port ${process.env.PORT} (${process.env.NODE_ENV})`);
});
