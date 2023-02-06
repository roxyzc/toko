import { Model, DataTypes } from "sequelize";
import db from "../configs/database.config";
import Image from "./image.model";

export interface IStoreModel {
  idStore?: string;
  nameStore: string;
  idCloud?: string | null;
  access?: any;
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
  image?: any;
}

Store.init(
  {
    idStore: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    idCloud: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nameStore: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      beforeCreate: store => {
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
Image.hasOne(Store, { foreignKey: "idCloud" });
Store.belongsTo(Image, { as: "image", foreignKey: "idCloud" });
export default Store;
