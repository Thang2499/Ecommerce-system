import { decodeToken, generateToken } from "../middleware/createjwt.js";
import itemModel from "../models/itemModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const userController = {
    register: async (req,res)=>{
        try{
            const {name,email,password} = req.body;
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password,salt)
            const user = await userModel.create({
                name,
                email,
                password:hashPassword
            });
            res.status(200).send({
                message: ' register success',
                user
            })
        }catch(err){
            res.status(500).send({
                message: 'register error'
            })
        }
    },
    login: async (req,res)=>{
        try{
            const {email} = req.body;
            const user = await userModel.findOne({email});
            const token = generateToken({user});
            res.cookie('token',token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            
            res.status(200).send({
                message: 'login success',
                user,
                token:token
            })
        }catch(err){
            res.status(500).send({
                message: err.message
            })
        }
    },
    list: async (req,res) =>{
        try{
            const query = req.query;
            const startPo = (query.page -1) * query.limit;
            const endPo = startPo + query.limit;
          const getList = await productModel.find({}).skip(startPo).limit(endPo);
          res.send(getList)
        }catch(err){
            res.send({
                message: err.message
            })
        }
       
    },
    addWishList: async (req,res)=>{
        try {
            const {id,wishlist} = req.body
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: 'Access denied, no token provided' });
            }
            const decoded = decodeToken(token);
            req.user = decoded.user;
            const user = await userModel.findByIdAndUpdate(id,{
                $addToSet: { wishlist: { $each: wishlist } }
            },
            { new: true } )
            res.status(200).send({
                message: 'success',
                user
            })
        }catch(err){
            res.send({
                message: err.message
            })
        }
    },
    removeFromWishList: async (req,res) =>{
        try {
            const { id, productId } = req.body;
            const user = await userModel.findByIdAndUpdate(
                id,
                {
                    $pull: { wishlist: { productId: productId } },
                },
                { new: true }
            );
    
            res.status(200).json({
                message: 'Xóa sản phẩm khỏi wishlist thành công!',
                wishlist: user.wishlist,
            });
        } catch (err) {
            res.status(500).json({
                message: 'Lỗi khi xóa sản phẩm khỏi wishlist.',
                error: err.message,
            });
        }
    },
    addToCart: async (req,res) =>{
        try {
            const { id, productId, quantity, unitPrice } = req.body;
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: 'Access denied, no token provided' });
            }
            const decoded = decodeToken(token);
            req.user = decoded.user;

            const user = await userModel.findById(id);
    
            const existingItem = await itemModel.findOne({
                productId,
                userId:id,
            });
    
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalPrice = existingItem.quantity * unitPrice;
                const updatedItem = await existingItem.save();
    
                return res.status(200).json({
                    message: 'Cập nhật sản phẩm trong giỏ hàng thành công!',
                    item: updatedItem,
                });
            }
            const newItem = new itemModel({
                productId,
                userId:id,
                quantity,
                unitPrice,
                totalPrice: quantity * unitPrice,
            });
            const savedItem = await newItem.save();
            if (!user.cart.find((item) => item.itemId === savedItem._id.toString())) {
                user.cart.push({ itemId: savedItem._id });
                await user.save();
            }
    
            await user.save();
            res.status(200).send({
                message: 'success',
                user
            })
        } catch (err) {
            res.send({
                message: err.message
            })
        }
    },
    removeFromCart: async (req,res) =>{
        try {
            const { id, itemId  } = req.body;
            const deletedItem = await itemModel.findByIdAndDelete(itemId);

            if (!deletedItem) {
                return res.status(404).json({
                    message: 'Không tìm thấy mục trong giỏ hàng.',
                });
            }
    
            // Xóa itemId khỏi giỏ hàng trong userModel
            const user = await userModel.findByIdAndUpdate(
                id,
                {
                    $pull: { cart: { itemId } },
                },
                { new: true }
            );
    
            if (!user) {
                return res.status(404).json({
                    message: 'Không tìm thấy người dùng.',
                });
            }
        } catch (err) {
            res.status(500).json({
                message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng.',
                error: err.message,
            });
        }
    }
}
export default userController;