"use strict";
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
        type: sequelize_1.DataTypes.STRING,
        defaultValue: (0, sequelize_1.UUIDV4)(),
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
    updatedAt: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    expiredAt: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
}, {
    hooks: {
        beforeCreate: (otp) => {
            const time = Number(new Date().getTime()) + 180000;
            const createdAtAndUpdatedAt = new Date().getTime();
            otp.expiredAt = Number(time);
            otp.updatedAt = Number(createdAtAndUpdatedAt);
            otp.createdAt = Number(createdAtAndUpdatedAt);
        },
    },
    timestamps: false,
    sequelize: database_config_1.default,
    tableName: "Otps",
    freezeTableName: true,
});
exports.default = Otp;
