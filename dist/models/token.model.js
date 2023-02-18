"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../configs/database.config"));
class Token extends sequelize_1.Model {
}
Token.init({
    tokenId: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: (0, sequelize_1.UUIDV4)(),
        primaryKey: true,
        allowNull: false,
    },
    accessToken: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: true,
    },
    refreshToken: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: true,
    },
}, {
    sequelize: database_config_1.default,
    timestamps: false,
    tableName: "Tokens",
    freezeTableName: true,
});
Token.removeAttribute("id");
exports.default = Token;
