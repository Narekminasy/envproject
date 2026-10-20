import "dotenv/config";
import CryptoJS from "crypto-js";
import DBMysql from "../clients/db.mysql.js";

const {
    TOKEN_SECRET,
} = process.env;


if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET is missing");
}

export async function findById(id) {
    try {
        const [result] = await DBMysql(`SELECT * FROM users WHERE id= ? limit 1`, [id]);

        return result && result.length ? result[0] : null;
    }catch(err) {
        console.log(err);
    }
}

export async function findByEmail(email) {
    try {
        const [result] = await DBMysql(`SELECT * FROM users WHERE email= ? limit 1`, [email]);

        return result && result.length ? result[0] : null;
    }catch(err) {
        console.log(err);
    }
}

export async function checkEmailUnique(email) {
    const user = await findByEmail(email);
    return !!user;
}


export async function creat(name, email,password) {
    try {
        const [result] = await DBMysql(`
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        `, [name, email, password]);

        return result && null;
    }catch(err) {
        console.log(err);
    }
}

export function encrypt(data) {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        TOKEN_SECRET
    ).toString();
}

export function decrypt(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(
            ciphertext,
            TOKEN_SECRET
        );
        return JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
        );
    } catch (e) {

        console.log(e);
        return null;
    }
}


