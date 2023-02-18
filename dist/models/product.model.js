"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../configs/database.config"));
const image_model_1 = __importDefault(require("./image.model"));
class Product extends sequelize_1.Model {
}
Product.init({
    idProduct: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: (0, sequelize_1.UUIDV4)(),
    },
    idStore: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    nameProduct: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    discount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    stoke: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    detail: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: false,
    },
    idImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.BIGINT(),
        allowNull: true,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.BIGINT(),
        allowNull: true,
    },
}, {
    hooks: {
        beforeCreate: data => {
            const createdAtAndUpdatedAt = new Date().getTime();
            data.createdAt = Number(createdAtAndUpdatedAt);
            data.updatedAt = Number(createdAtAndUpdatedAt);
        },
    },
    sequelize: database_config_1.default,
    timestamps: false,
    tableName: "Products",
    freezeTableName: true,
});
Product.removeAttribute("id");
image_model_1.default.hasOne(Product, { foreignKey: "idImage" });
Product.belongsTo(image_model_1.default, { as: "image", foreignKey: "idImage" });
exports.default = Product;
