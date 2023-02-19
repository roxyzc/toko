import { DataTypes, Model, UUIDV4 } from "sequelize";
import Product from "./product.model";
import db from "@config/database.config";

export interface ICartModel {
  idCart?: string;
  userId: string;
  idStore: string;
  idProduct: string;
  count: Number;
  price: Number;
  totalPrice: Number;
  createdAt?: Number;
  updatedAt?: Number;
}

class Cart extends Model<ICartModel> {
  createdAt?: Number;
  updatedAt?: Number;
}

Cart.init(
  {
    idCart: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4(),
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idStore: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idProduct: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: data => {
        const createdAtAndUpdatedAt = new Date().getTime();
        data.createdAt = Number(createdAtAndUpdatedAt);
        data.updatedAt = Number(createdAtAndUpdatedAt);
      },
    },
    sequelize: db,
    timestamps: false,
    freezeTableName: true,
    tableName: "Cart",
  }
);

Cart.removeAttribute("id");
Product.hasOne(Cart, { foreignKey: "idProduct" });
Cart.belongsTo(Product, { as: "product", foreignKey: "idProduct" });
export default Cart;
