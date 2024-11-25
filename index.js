import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import indexRoute from './src/routes/indexRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Địa chỉ frontend của bạn
    credentials: true,                // Để cho phép gửi cookie
  }));

await mongoose.connect(process.env.connect).then(()=>{
    console.log('connect mongoose success');
});

app.use('',indexRoute);

app.listen(process.env.PORT || 8080,()=>{
    console.log('server is running');
});