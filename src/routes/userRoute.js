import express from 'express';
import userController from '../controllers/userController.js';
import userMiddleware from '../middleware/userMiddleware.js';
import authenticateToken from '../middleware/jwtRoleAdmin.js';

const userRoute = express.Router();

userRoute.post('/register',userMiddleware.checkRegister,userController.register);
userRoute.post('/login',userMiddleware.checkLogin,userController.login);
userRoute.get('/list',authenticateToken,userController.list);
userRoute.post('/wishList',authenticateToken,userController.addWishList);
userRoute.post('/addToCart',authenticateToken,userController.addToCart);


export default userRoute;