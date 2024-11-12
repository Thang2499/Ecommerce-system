import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).send({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.secretKey); 
        req.user = decoded.user; 
        if(decoded.user.role !== "admin"){
            return res.send('bạn không có quyền truy cập vào trang này')
        };
        next();
    } catch (err) {
        return res.status(403).send({ message: 'Invalid token' });
    }
};

export default authenticateToken;
