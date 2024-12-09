import dotenv from 'dotenv';
import { decodeToken } from './createjwt.js';
import userModel from '../models/userModel.js';
dotenv.config();
const authenticateToken = async (req, res, next) => {
    // const token = req.cookies.token; 
    // if (!token) {
    //     return res.status(401).send({ message: 'Access denied, no token provided' });
    // }
    // try {
    //     const decoded = decodeToken(token); 
    //     req.user = decoded.user; 
    //     // if(decoded.user.role !== "custumer"){
    //     //     return res.send('tạo tài khoản cá nhân trước khi đăng ký shop')
    //     // };
    try {

        const authorizationData = req.headers['authorization']
        // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjE2ZTk0NDQyYmVkYTZjZGU5MzIiLCJpYXQiOjE3MzA1NTY2OTMsImV4cCI6MTczMDU2MDI5M30.kjjgI3qomhvDimlBVN8LdUDDyFIjkmI59pS1EP_Iu0k
        if (!authorizationData) {
           return res.status(401).send("Unauthenticated")
        }
        const accessToken = authorizationData.split(' ')[1]
        if (!accessToken) {
            return res.status(401).send("Unauthenticated")
         }
        const userData = decodeToken(accessToken)
        if(userData.status === 401){
            return res.status(401).send('Unauthenticated')
        }
        const user = await userModel.findById(userData.user._id).populate({
            path: 'shopId',
            model: 'shops'
        });
        if (!user){
            return res.status(404).send("User not found")
         }
        req.user = user
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default authenticateToken;
