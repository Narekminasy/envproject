import CryptoJS from 'crypto-js';
import {DataTypes, Model} from "sequelize";
import db from "../clients/db.sequelize.js";

const {PASSWORD_SECRET} = process.env;

if (!PASSWORD_SECRET) {
    throw new Error("PASSWORD_SECRET is missing");
}

class Users extends Model {
    static hashPassword(password) {
        return CryptoJS.HmacSHA256(
            password,
            PASSWORD_SECRET
        ).toString(CryptoJS.enc.Hex);
    }
}


Users.init({
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    sequelize:db,
    modelName: 'Users',
    tableName: 'users',
    timestamps: false,
});

export default Users;