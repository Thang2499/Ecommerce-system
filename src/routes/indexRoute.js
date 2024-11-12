import express from 'express'
import userRoute from './userRoute.js';

const indexRoute = express.Router();
indexRoute.use('/users',userRoute);


export default indexRoute;