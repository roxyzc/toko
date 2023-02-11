import { Model, DataTypes, UUIDV4 } from "sequelize";
import db from "../configs/database.config";

export interface ITokenModel {
  tokenId?: string;
  accessToken?: string;
  refreshToken?: string;
}

class Token extends Model<ITokenModel> {}

Token.init(
  {
    tokenId: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4(),
      primaryKey: true,
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: "Tokens",
    freezeTableName: true,
  }
);

Token.removeAttribute("id");

export default Token;
