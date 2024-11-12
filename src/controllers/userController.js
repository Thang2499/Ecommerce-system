import { generateToken } from "../middleware/jwt.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const userController = {
    register: async (req,res)=>{
        try{
            const {name,email,password} = req.body;
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password,salt)
            const user = await userModel.create({
                name,
                email,
                password:hashPassword
            });
            res.status(200).send({
                message: ' register success',
                user
            })
        }catch(err){
            res.status(500).send({
                message: 'register error'
            })
        }
    },
    login: async (req,res)=>{
        try{
            const {email} = req.body;
            const user = await userModel.findOne({email});
            const token = generateToken({user});
            res.cookie('token',token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                maxAge: 24 * 60 * 60 * 1000
            })
            res.status(200).send({
                message: 'login success',
                user,
                token:token
            })
        }catch(err){
            res.status(500).send({
                message: err.message
            })
        }
    },
    list: async (req,res) =>{
        try{
            // const {email} = req.body;
            const userlist = await userModel.find({});
            res.send({
                data:userlist
            })
        }catch(err){
            res.send({
                message: err.message
            })
        }
       
    }
}
export default userController;