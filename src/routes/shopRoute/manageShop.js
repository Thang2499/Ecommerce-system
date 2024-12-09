import express from 'express';
import shopController from '../../controllers/shopController.js';
import multer from 'multer';
import authenticateToken from '../../middleware/authenticateToken.js';
import GHNController from '../../controllers/GHNController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const manageShop = express.Router();
manageShop.get('/shopPage',authenticateToken,shopController.getShop);
manageShop.get('/productList',authenticateToken,shopController.productList);
manageShop.post('/addProduct',authenticateToken,upload.array('files',1),shopController.addProduct);
manageShop.post('/updateProduct',authenticateToken,upload.array('files',4),shopController.updateProduct);
manageShop.post('/deleteProduct',authenticateToken,shopController.deleteProduct);
manageShop.post('/payment',shopController.paymentMethod);
manageShop.get('/manageOrder',authenticateToken,shopController.manageOrder);
manageShop.put('/updateOrder/:orderId',authenticateToken,shopController.updateOrder);

manageShop.get('/provinces',GHNController.getProvinces);
manageShop.get('/districts/:province_id',GHNController.getDistricts);
manageShop.get('/wards/:district_id',GHNController.getWards);
manageShop.post('/shippingFee',GHNController.shippingFee);
export default manageShop;