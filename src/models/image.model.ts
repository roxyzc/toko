import { Model, DataTypes } from "sequelize";
import db from "@config/database.config";

interface IImageModel {
  idCloud: string;
  secure_url: string;
}

class Image extends Model<IImageModel> {}

Image.init(
  {
    idCloud: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    secure_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: "Images",
    freezeTableName: true,
  }
);

Image.removeAttribute("id");

export default Image;
