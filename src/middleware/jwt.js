import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

 export const generateToken = (data)=>{
    const token = jwt.sign(data,process.env.secretKey,{expiresIn:'10h'});
    return token;
 }

 export const generateRefreshToken = (data)=>{
    const token = jwt.sign(data,process.env.secretKey,{expiresIn: '365d' });
    return token;
 }

 export const decodeToken = (token)=>{
     return jwt.verify(token,process.env.secretKey,(err,decode)=>{
        if(err){
            console.log('JWT verification',err.message)
        }else{
            return decode
        }
     });
 }

