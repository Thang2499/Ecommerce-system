import express from 'express';
import shopController from '../../controllers/shopController.js';
import shopMiddleware from '../../middleware/shopMiddleware.js';

import manageShop from './manageShop.js';
import authenticateToken from '../../middleware/authenticateToken.js';

const shopRoute = express.Router();

shopRoute.post('/registerShop',authenticateToken,shopMiddleware.checkRegisterShop,shopController.register);
shopRoute.use('/shop',manageShop)

export default shopRoute;