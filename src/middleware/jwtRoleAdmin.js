import dotenv from 'dotenv';
import { decodeToken } from './createjwt.js';
dotenv.config();
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
        return res.status(401).send({ message: 'Access denied, no token provided' });
    }
    try {
        const decoded = decodeToken(token); 
        req.user = decoded.user; 
        // if(decoded.user.role !== "custumer"){
        //     return res.send('tạo tài khoản cá nhân trước khi đăng ký shop')
        // };
        next();
    } catch (err) {
        return res.status(403).send({ message: 'Invalid token' });
    }
};

export default authenticateToken;
