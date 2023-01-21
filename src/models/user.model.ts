import { Model, DataTypes } from "sequelize";
import db from "../configs/database.config";

interface IUserModel {
  id: string;
  nama: string;
  password: string;
  status: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  expiredAt?: Date;
}

class User extends Model<IUserModel> {}

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
      type: DataTypes.ENUM("admin", "karyawan"),
      defaultValue: "admin",
      allowNull: false,
    },
    createdAt: "",
    updatedAt: "",
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: function (this: IUserModel) {
        return this.status === "active"
          ? undefined
          : new Date(new Date().setHours(new Date().getHours() + 2));
      },
    },
  },
  {
    timestamps: true,
    sequelize: db,
    tableName: "Users",
  }
);

// @Table({
//   timestamps: true,
//   tableName: "User",
// })
// export class User extends Model {
//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   nama!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   password!: string;
// }
