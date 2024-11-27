import express from 'express';
import shopController from '../../controllers/shopController.js';
import multer from 'multer';
import authenticateToken from '../../middleware/authenticateToken.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const manageShop = express.Router();
manageShop.get('/shopPage',authenticateToken,shopController.getShop);
manageShop.get('/productList',authenticateToken,shopController.productList);
manageShop.post('/addProduct',upload.array('files',4),shopController.addProduct);
manageShop.post('/updateProduct',upload.fields([{ name: 'files', maxCount: 4 },{ name: 'file', maxCount: 1 }]),shopController.updateProduct);
manageShop.post('/deleteProduct',shopController.deleteProduct);
export default manageShop;