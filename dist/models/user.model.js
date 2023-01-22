"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../configs/database.config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_model_1 = __importDefault(require("./token.model"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    nama: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("active", "pending"),
        defaultValue: "pending",
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("admin", "pemilik", "karyawan", "user"),
        defaultValue: "user",
        allowNull: false,
    },
    tokenId: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    expiredAt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    hooks: {
        beforeCreate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            const time = new Date(new Date().setHours(new Date().getHours() + 24));
            const createdAtAndUpdatedAt = new Date().getTime();
            String(user.status) == "active"
                ? undefined
                : (user.expiredAt = String(time.getTime()));
            user.createdAt = String(createdAtAndUpdatedAt);
            user.updatedAt = String(createdAtAndUpdatedAt);
        }),
        beforeSave: (user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.changed("password")) {
                const salt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
                const hashPassword = yield bcrypt_1.default.hash(user.getDataValue("password"), salt);
                user.password = hashPassword;
            }
        }),
    },
    sequelize: database_config_1.default,
    timestamps: false,
    tableName: "Users",
    freezeTableName: true,
});
User.prototype.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default
            .compare(candidatePassword, this.getDataValue("password"))
            .catch(() => false);
    });
};
User.hasOne(token_model_1.default, { foreignKey: "tokenId" });
User.belongsTo(token_model_1.default, { foreignKey: "tokenId" });
exports.default = User;
