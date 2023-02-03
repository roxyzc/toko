"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../configs/database.config"));
const store_model_1 = __importDefault(require("./store.model"));
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
}, {
    sequelize: database_config_1.default,
    timestamps: false,
    tableName: "Products",
    freezeTableName: true,
});
Product.removeAttribute("id");
store_model_1.default.hasOne(Product, { foreignKey: "idStore" });
Product.belongsTo(store_model_1.default, { as: "store", foreignKey: "idStore" });
exports.default = Product;
