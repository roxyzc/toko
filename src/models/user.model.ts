import { Model, DataTypes } from "sequelize";
import db from "../configs/database.config";
import bcrypt from "bcrypt";
import { STATUS, ROLE } from "../types/default";

export interface IUserModel {
  id: string;
  nama: string;
  email: string;
  password: string;
  status?: STATUS;
  role?: ROLE;
  createdAt?: Date;
  updatedAt?: Date;
  expiredAt?: Date;
}

class User extends Model<IUserModel> {
  nama?: string;
  email?: string;
  password?: string;
  status?: STATUS;
  role?: ROLE;
  createdAt?: Date;
  updatedAt?: Date;
  expiredAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "pending"),
      defaultValue: "pending",
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "pemilik", "karyawan", "user"),
      defaultValue: "user",
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: undefined,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        String(user.status) == "active"
          ? undefined
          : (user.expiredAt = new Date(
              new Date().setHours(new Date().getHours() + 24)
            ));

        user.password = await bcrypt.hash(
          user.password as string,
          Number(process.env.SALT)
        );
      },
    },
    timestamps: true,
    sequelize: db,
    tableName: "Users",
  }
);

export default User;
