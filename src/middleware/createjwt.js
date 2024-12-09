import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
dotenv.config();
 export const generateToken = (data)=>{
    const token = jwt.sign(data,process.env.secretKey,{expiresIn:'1d'});
    return token;
 }

 export const generateRefreshToken = (data)=>{
    const token = jwt.sign(data,process.env.secretKey,{expiresIn: '365d' });
    return token;
 }

 export const decodeToken = (token)=>{
    try {
        const decoded = jwt.verify(token, process.env.secretKey);
        return decoded;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return { status: 401, message: 'Token expired' };
        } else {
            return { status: 401, message: 'Invalid token' };
        }
    }
 }
 export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        jwt.verify(refreshToken, process.env.secretKey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
            const userId = decoded.user._id;
            const user = await userModel.findById(userId).populate({
                path: 'shopId',
                model: 'shops'
            });;
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            const newAccessToken = jwt.sign(
                { user:user},
                process.env.secretKey,
                { expiresIn: '1d' }
            );

            return res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

