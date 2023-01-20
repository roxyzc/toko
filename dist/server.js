"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_log_1 = require("./log/logger.log");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
if (process.env.NODE_ENV)
    app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.listen(process.env.PORT, () => {
    logger_log_1.logger.info(`Listen at port ${process.env.PORT} (${process.env.NODE_ENV})`);
});
