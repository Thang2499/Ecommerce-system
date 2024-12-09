import express from 'express'
import userRoute from './userRoute.js';
import shopRoute from './shopRoute/shopRoute.js';
import { refreshAccessToken } from '../middleware/createjwt.js';

const indexRoute = express.Router();
indexRoute.use('/users',userRoute);
indexRoute.use('/shop',shopRoute);
indexRoute.post('/refresh-token', refreshAccessToken);
export default indexRoute;