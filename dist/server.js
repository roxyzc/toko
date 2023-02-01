"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const logger_log_1 = require("./logs/logger.log");
const errorHandlers_middleware_1 = require("./middlewares/errorHandlers.middleware");
require("dotenv/config");
const database_config_1 = __importDefault(require("./configs/database.config"));
const index_1 = __importDefault(require("./auth/index"));
const index_2 = __importDefault(require("./other/index"));
const index_3 = __importDefault(require("./stores/index"));
const otp_service_1 = __importDefault(require("./services/otp.service"));
const user_service_1 = __importDefault(require("./services/user.service"));
database_config_1.default.sync({ alter: true, force: false })
    .then(() => {
    logger_log_1.logger.info("Connection to database successfully");
})
    .catch(error => {
    console.log(error);
    logger_log_1.logger.error("Connection to database failed");
    process.exit(1);
});
const app = (0, express_1.default)();
if (process.env.NODE_ENV)
    app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
otp_service_1.default;
user_service_1.default;
app.use("/api/auth", index_1.default);
app.use("/api", index_2.default);
app.use("/api/store", index_3.default);
app.use(errorHandlers_middleware_1.notFound);
app.use(errorHandlers_middleware_1.errorHandler);
app.listen(process.env.PORT, () => {
    logger_log_1.logger.info(`Listen at port ${process.env.PORT} (${process.env.NODE_ENV})`);
});
