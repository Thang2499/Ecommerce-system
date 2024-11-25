import express from 'express'
import userRoute from './userRoute.js';
import shopRoute from './shopRoute/shopRoute.js';

const indexRoute = express.Router();
indexRoute.use('/users',userRoute);

indexRoute.use('/shop',shopRoute)
export default indexRoute;