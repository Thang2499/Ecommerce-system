import express from 'express';
import userController from '../controllers/userController.js';
import userMiddleware from '../middleware/userMiddleware.js';
import authenticateToken from '../middleware/authenticateToken.js';

const userRoute = express.Router();

userRoute.post('/register',userMiddleware.checkRegister,userController.register);
userRoute.post('/login',userMiddleware.checkLogin,userController.login);
userRoute.get('/list',userController.list);
userRoute.post('/editProfile',authenticateToken,userController.editProfile);
userRoute.post('/wishList',authenticateToken,userController.addWishList);
userRoute.post('/addToCart',authenticateToken,userController.addToCart);
userRoute.get('/viewCart',authenticateToken,userController.handleCart);
userRoute.post('/createOrder',authenticateToken,userController.createOrder);
userRoute.get('/viewOrder',authenticateToken,userController.viewOrder);
userRoute.post('/productDetail',userController.productDetail);
userRoute.post('/productByCategory',userController.productByCategory);
userRoute.post('/productSearch/:name',userController.searchProduct);


export default userRoute;