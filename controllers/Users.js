import jwt from 'jsonwebtoken';
import Users from '../models/Users.js';
import HttpErrors, {isHttpError} from "http-errors";
import moment from 'moment';


const {JWT_SECRET} = process.env;

export const controller = {

    async profile(req, res) {
        try {
            res.json({
                message: "Profile found",
            });
        }catch(err) {
            console.log(err)
        }
    },


    async login (req, res, next) {
        try {
            const {name,email, password} = req.body;

            const users = await Users.findOne({where: {email}});

            if (!user) {
                return res.status(403).json({
                    message: "Invalid email or password."
                });
            }

            const inputHash = Users.hashPassword(password);

            if(user.password !== inputHash) {
                return res.status(403).json({
                    message: "Invalid email or password."
                });
            }


            const token = jwt.sign({
                userID: users.id,

            }, JWT_SECRET, {expiresIn: '1h'});

            const usersResponse = user.JSON();
            delete usersResponse.password;

            res.cookie("usertoken", token, {
                httpOnly: true,
                secure: false, // development-ի համար
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });


            res.json({
                message: "Login successfully",
                token,
                user: userResponse,
            });

        }catch(err) {
            console.log(err)
            next(err);
        }
    },

    async register (req, res,next) {
        try {
            const {name, email, password} = req.body;

            const emailExists = await Users.findOne({ where: { email } });


            if (emailExists) {
                return next(
                    HttpErrors(422, "Email is already in use!")
                );
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

            const expiresAt = moment().add(15, "minutes").toDate();

            const user = await Users.create({
                name,
                age,
                email,
                password: Users.hashPassword(password),
                verification_code: otpCode,
                code_expires_at: expiresAt,
                is_verified: false,
            });

            const userResponse = JSON.parse(JSON.stringify(user));
            delete userResponse.password;

            res.json({
                success: true,
                message: "Successfully registered",
                user: userResponse,
            })

        }catch(err) {
            console.log(err)
            next(err)
        }
    }

}