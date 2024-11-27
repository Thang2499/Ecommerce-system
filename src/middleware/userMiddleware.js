import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
const userMiddleware = {
    checkRegister: async (req,res,next)=>{
        try{
            const {email,password} = req.body;
            if( !email || !password) {
              return  res.send('điền đầy đủ thông tin đăng ký');
            } 
            const checkEmail = await userModel.findOne({email});
            if(checkEmail){
                return  res.status(400).send('tài khoản đã tồn tại')
            }
            next();
        }catch(err){
    res.status(400).send({
        message:'register error'
    })
    }
    },
    checkLogin: async (req,res,next)=>{
        try{
            const {email,password} = req.body;
            if(!email || !password){
                return  res.send('điền đầy đủ thông tin đăng nhập');
            } 
            const user = await userModel.findOne({email});
            if(!user){
                return  res.send('Email không tồn tại');
            } 
            const comparePassword = await bcrypt.compare(password, user.password);
            if(!comparePassword){
                return  res.send('sai mật khẩu')
            };
            next();
        }catch(err){
            res.status(400).send({
                message:'login fail'
            })
            }
    }
}
export default userMiddleware;