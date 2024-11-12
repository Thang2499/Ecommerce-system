import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import indexRoute from './src/routes/indexRoute.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

await mongoose.connect(process.env.connect).then(()=>{
    console.log('connect mongoose success');
});

app.use('',indexRoute);

app.listen(process.env.PORT || 8080,()=>{
    console.log('server is running');
});