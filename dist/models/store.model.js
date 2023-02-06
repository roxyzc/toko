"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../configs/database.config"));
const image_model_1 = __importDefault(require("./image.model"));
class Store extends sequelize_1.Model {
}
Store.init({
    idStore: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    idCloud: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    nameStore: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    access: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    tax: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    discount: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    income: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
}, {
    hooks: {
        beforeCreate: store => {
            const createdAtAndUpdatedAt = new Date().getTime();
            store.createdAt = Number(createdAtAndUpdatedAt);
            store.updatedAt = Number(createdAtAndUpdatedAt);
        },
    },
    sequelize: database_config_1.default,
    timestamps: false,
    tableName: "Stores",
    freezeTableName: true,
});
Store.removeAttribute("id");
image_model_1.default.hasOne(Store, { foreignKey: "idCloud" });
Store.belongsTo(image_model_1.default, { as: "image", foreignKey: "idCloud" });
exports.default = Store;
