import { Model, DataTypes } from "sequelize";
import db from "../configs/database.config";
import { TYPE } from "../types/default";
export interface IOtpModel {
  id?: Number;
  ip: string;
  email: string;
  otp: string;
  type?: TYPE;
  createdAt?: Number;
  expiredAt?: Number;
}

class Otp extends Model<IOtpModel> {
  ip?: string;
  email?: string;
  otp?: string;
  type?: TYPE;
  createdAt?: Number;
  expiredAt?: Number;
}

Otp.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("register", "forgotPassword"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    expiredAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (otp) => {
        // const time = new Date(new Date().setHours(new Date().getMinutes() + 5));
        const time = Number(new Date().getTime()) + 300000;
        const createdAt = new Date().getTime();
        otp.expiredAt = Number(time);
        otp.createdAt = Number(createdAt);
      },
    },
    timestamps: false,
    sequelize: db,
    tableName: "Otps",
    freezeTableName: true,
  }
);

export default Otp;
