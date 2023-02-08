import { Model, DataTypes, UUIDV4 } from "sequelize";
import db from "@config/database.config";

interface IImageModel {
  idImage?: string;
  idCloud: string;
  secure_url: string;
}

class Image extends Model<IImageModel> {}

Image.init(
  {
    idImage: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4(),
    },
    idCloud: {
      type: DataTypes.STRING,
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
