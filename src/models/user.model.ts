import { Model, DataTypes } from "sequelize";
import db from "../configs/database.config";
import bcrypt from "bcrypt";
import { STATUS, ROLE } from "../types/default";
import Token from "./token.model";

export interface IUserModel {
  id: string;
  nama: string;
  email: string;
  password: string;
  status?: STATUS;
  role?: ROLE;
  tokenId?: string;
  createdAt?: Number;
  updatedAt?: Number;
  expiredAt?: Number | null;
}

class User extends Model<IUserModel> {
  nama?: string;
  email?: string;
  password?: string;
  status?: STATUS;
  role?: ROLE;
  tokenId?: string;
  createdAt?: Number;
  updatedAt?: Number;
  expiredAt?: Number | null;
  comparePassword?: (candidatePassword: string) => Promise<Boolean>;
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
      unique: "email",
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
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: "tokenId",
    },
    createdAt: {
      type: DataTypes.BIGINT(),
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.BIGINT(),
      allowNull: true,
    },
    expiredAt: {
      type: DataTypes.BIGINT(),
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async user => {
        const time = new Date(new Date().setHours(new Date().getHours() + 24));
        const createdAtAndUpdatedAt = new Date().getTime();
        String(user.status) == "active" ? (user.expiredAt = undefined) : (user.expiredAt = Number(time.getTime()));
        user.createdAt = Number(createdAtAndUpdatedAt);
        user.updatedAt = Number(createdAtAndUpdatedAt);
      },
      beforeSave: async user => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashPassword = await bcrypt.hash(user.getDataValue("password") as string, salt);
          user.password = hashPassword;
        }
      },
    },
    sequelize: db,
    timestamps: false,
    tableName: "Users",
    freezeTableName: true,
  }
);

User.prototype.comparePassword = async function (candidatePassword: string): Promise<Boolean> {
  return await bcrypt.compare(candidatePassword as string, this.getDataValue("password") as string).catch(() => false);
};

Token.hasOne(User, { foreignKey: "tokenId" });
User.belongsTo(Token, { as: "token", foreignKey: "tokenId" });

export default User;
