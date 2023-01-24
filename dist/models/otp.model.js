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
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../configs/database.config"));
class Otp extends sequelize_1.Model {
}
Otp.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    ip: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    otp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("register", "forgotPassword"),
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    expiredAt: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
}, {
    hooks: {
        beforeCreate: (otp) => __awaiter(void 0, void 0, void 0, function* () {
            // const time = new Date(new Date().setHours(new Date().getMinutes() + 5));
            const time = Number(new Date().getTime()) + 300000;
            const createdAt = new Date().getTime();
            otp.expiredAt = Number(time);
            otp.createdAt = Number(createdAt);
        }),
    },
    timestamps: false,
    sequelize: database_config_1.default,
    tableName: "Otps",
    freezeTableName: true,
});
exports.default = Otp;
