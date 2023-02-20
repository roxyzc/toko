import { Model, DataTypes, UUIDV4 } from "sequelize";
import db from "../configs/database.config";
import Image from "./image.model";
import Store from "./store.model";

export interface IProductModel {
  idProduct?: string;
  idStore: string;
  nameProduct: string;
  price: Number;
  discount?: Number;
  stoke: Number;
  category: string;
  detail: string;
  idImage: string;
  createdAt?: Number;
  updatedAt?: Number;
}

class Product extends Model<IProductModel> {
  createdAt?: Number;
  updatedAt?: Number;
  image?: any;
  store?: any;
}

Product.init(
  {
    idProduct: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4(),
    },
    idStore: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameProduct: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stoke: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    idImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.BIGINT(),
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.BIGINT(),
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
    tableName: "Products",
    freezeTableName: true,
  }
);

Product.removeAttribute("id");
Image.hasOne(Product, { foreignKey: "idImage" });
Product.belongsTo(Image, { as: "image", foreignKey: "idImage" });
Store.hasOne(Product, { foreignKey: "idStore" });
Product.belongsTo(Store, { as: "store", foreignKey: "idStore" });
export default Product;
