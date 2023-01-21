"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const logger_log_1 = require("../../../logs/logger.log");
// import { logger } from "../../../logs/logger.log";
const user_model_1 = __importDefault(require("../../../models/user.model"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nama, email, password } = req.body;
    try {
        let id = new short_unique_id_1.default().randomUUID(8);
        let cekId = true;
        while (cekId) {
            const findUser = yield user_model_1.default.findOne({
                where: {
                    id,
                },
            });
            if (!findUser) {
                cekId = false;
            }
            else {
                id = new short_unique_id_1.default().randomUUID(8);
            }
        }
        const user = yield user_model_1.default.create({
            id,
            nama: nama,
            email: email,
            password: password,
        });
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        logger_log_1.logger.error(error.message);
        next(error);
    }
});
exports.default = register;
