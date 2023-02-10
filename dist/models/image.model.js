"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../configs/database.config"));
class Image extends sequelize_1.Model {
}
Image.init({
    idImage: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: (0, sequelize_1.UUIDV4)(),
    },
    idCloud: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    secure_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_config_1.default,
    timestamps: false,
    tableName: "Images",
    freezeTableName: true,
});
Image.removeAttribute("id");
exports.default = Image;
