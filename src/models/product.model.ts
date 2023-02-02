import { Model, DataTypes, UUIDV4 } from "sequelize";
import db from "../configs/database.config";
import Store from "./store.model";

export interface IProductModel {
  idProduct: String;
  idStore: Number;
  nameProduct: string;
  price: Number;
}

class Product extends Model<IProductModel> {}

Product.init(
  {
    idProduct: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4(),
    },
    idStore: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
    },
    nameProduct: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: "Products",
    freezeTableName: true,
  }
);

Store.hasOne(Product, { foreignKey: "idStore" });
Product.belongsTo(Store, { as: "store", foreignKey: "idStore" });

Product.removeAttribute("id");
export default Product;
