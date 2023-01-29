import { Model, DataTypes } from "sequelize";
import db from "../configs/database.config";

export interface IStoreModel {
  idStore?: Number;
  nameStore: string;
  access?: any;
  product?: string;
  tax?: Number;
  discount?: Number;
  income?: Number;
  createdAt?: Number;
  updatedAt?: Number;
}

class Store extends Model<IStoreModel> {
  nameStore?: string;
  access?: any;
  createdAt?: Number;
  updatedAt?: Number;
}

Store.init(
  {
    idStore: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
    },
    nameStore: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: "product",
    },
    tax: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    discount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    income: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
      beforeCreate: (store) => {
        const createdAtAndUpdatedAt = new Date().getTime();
        store.createdAt = Number(createdAtAndUpdatedAt);
        store.updatedAt = Number(createdAtAndUpdatedAt);
      },
    },
    sequelize: db,
    timestamps: false,
    tableName: "Stores",
    freezeTableName: true,
  }
);

Store.removeAttribute("id");
export default Store;
