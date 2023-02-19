"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const product_model_1 = __importDefault(require("./product.model"));
const database_config_1 = __importDefault(require("../configs/database.config"));
class Cart extends sequelize_1.Model {
}
Cart.init({
    idCart: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: (0, sequelize_1.UUIDV4)(),
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    idStore: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    idProduct: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    totalPrice: {
        type: sequelize_1.DataTypes.BIGINT,
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
    freezeTableName: true,
    tableName: "Cart",
});
Cart.removeAttribute("id");
product_model_1.default.hasOne(Cart, { foreignKey: "idProduct" });
Cart.belongsTo(product_model_1.default, { as: "product", foreignKey: "idProduct" });
exports.default = Cart;
