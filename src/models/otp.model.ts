import { Model, DataTypes } from "sequelize";
import db from "../configs/database.config";
import { TYPE } from "../types/default";
export interface IOtpModel {
  id?: Number;
  ip: string;
  email: string;
  otp: string;
  type?: TYPE;
  createdAt?: string;
  expiredAt?: string;
}

class Otp extends Model<IOtpModel> {
  ip?: string;
  email?: string;
  otp?: string;
  type?: TYPE;
  createdAt?: string;
  expiredAt?: string;
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiredAt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (otp) => {
        const time = new Date(new Date().setHours(new Date().getMinutes() + 5));
        const createdAt = new Date().getTime();
        otp.expiredAt = String(time.getTime());
        otp.createdAt = String(createdAt);
      },
    },
    timestamps: false,
    sequelize: db,
    tableName: "Otps",
    freezeTableName: true,
  }
);

export default Otp;
