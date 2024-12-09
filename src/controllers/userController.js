import {generateRefreshToken, generateToken } from "../middleware/createjwt.js";
import itemModel from "../models/itemModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import shopModel from "../models/shopModel.js";
dotenv.config();
const userController = {
    register: async (req, res) => {
        try {
            const { email, password } = req.body;
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt)
            const user = await userModel.create({
                email,
                password: hashPassword
            });
            res.status(200).send({
                message: ' register success',
                user
            })
        } catch (err) {
            res.status(500).send({
                message: 'register error'
            })
        }
    },
    login: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await userModel.findOne({ email }).populate({
                path: 'shopId',
                model: 'shops'
            });
            const accessToken = generateToken({ user });
            const refreshToken = generateRefreshToken({ user })
            // res.cookie('token',accesstokentoken, {
            //     httpOnly: true,
            //     secure: false,
            //     sameSite: 'Lax',
            //     maxAge: 24 * 60 * 60 * 1000
            // })

            res.status(200).send({
                message: 'login success',
                user,
                accessToken,
                refreshToken
            })
        } catch (err) {
            res.status(500).send({
                message: err.message
            })
        }
    },
    list: async (req, res) => {
        try {
            const query = req.query;
            const startPo = (query.page - 1) * query.limit;
            const endPo = startPo + query.limit;
            const getList = await productModel.find({}).skip(startPo).limit(endPo);
            res.send(getList)
        } catch (err) {
            res.send({
                message: err.message
            })
        }

    },
    addWishList: async (req, res) => {
        try {
            const { id, wishlist } = req.body
            // const token = req.cookies.token;
            // if (!token) {
            //     return res.status(401).json({ message: 'Access denied, no token provided' });
            // }
            // const decoded = decodeToken(token);
            // req.user = decoded.user;
            const user = await userModel.findByIdAndUpdate(id, {
                $addToSet: { wishlist: { $each: wishlist } }
            },
                { new: true })
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
    removeFromWishList: async (req, res) => {
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
    addToCart: async (req, res) => {
        try {
            const { id, productId, quantity, unitPrice } = req.body;
            // const token = req.cookies.token;
            // if (!token) {
            //     return res.status(401).json({ message: 'Access denied, no token provided' });
            // }
            // const decoded = decodeToken(token);
            // req.user = decoded.user;
            const user = await userModel.findById(id);
            const existingItem = await itemModel.findOne({
                productId,
                userId: id,
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
                userId: id,
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
    removeFromCart: async (req, res) => {
        try {
            const { id, itemId } = req.body;
            const deletedItem = await itemModel.findByIdAndDelete(itemId);
            if (!deletedItem) {
                return res.status(404).json({
                    message: 'Không tìm thấy mục trong giỏ hàng.',
                });
            };
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
            };
            res.status(200).send('Delete success');
        } catch (err) {
            res.status(500).json({
                message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng.',
                error: err.message,
            });
        }
    },
    handleCart: async (req, res) => {
        try {
            const user = req.user;
            const cart = user.cart;
            const itemIds = cart.map(item => item.itemId);
            const itemsInCart = await itemModel.find({ _id: { $in: itemIds } }).populate({
                path: 'productId',
                model: 'products'
            });
            res.status(200).json({
                success: true,
                itemsInCart
            });
        } catch (error) {
            console.error('Error fetching cart items:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch cart items',
            });
        }
    },
    createOrder: async (req, res) => {
        const { address, selectedPayment, fee } = req.body
        const user = req.user;
        try {
            const userCart = await userModel.findById(user._id).populate({
                path: 'cart.itemId',
                populate: {
                    path: 'productId',
                    select: 'shopId price productName image',
                },
            });

            const itemsByShop = userCart.cart.reduce((acc, cartItem) => {
                const shopId = cartItem.itemId.productId.shopId.toString();
                if (!acc[shopId]) acc[shopId] = [];
                acc[shopId].push(cartItem);
                return acc;
            }, {});
            const orders = [];
            // const itemIdsToDelete = [];
            for (const shopId in itemsByShop) {
                const items = itemsByShop[shopId];

                let totalAmount = items.reduce((sum, item) => {
                    return parseFloat(item.itemId.unitPrice) * parseFloat(item.itemId.quantity) + parseFloat(sum) + parseFloat(fee);
                }, 0);
                if (selectedPayment === 'Momo') {
                    totalAmount = 0
                }
                const order = await orderModel.create({
                    userId: user._id,
                    shopId,
                    items: items.map(item => ({
                        itemId: item.itemId._id,
                    })),
                    totalAmount: Number(totalAmount),
                    paymentMethod: selectedPayment,
                    shippingAddress: address,
                });

                orders.push(order);
                // items.forEach(item => {
                //     itemIdsToDelete.push(item.itemId._id);
                // });
            }
            
            for (const order of orders) {
                await shopModel.updateOne(
                    { _id: order.shopId },
                    { $push: { orderIds: order._id } }
                );
            }
            await userModel.updateOne(
                { _id: user._id },
                { cart: [] }
            );
            // if (itemIdsToDelete.length > 0) {
            //     await itemModel.deleteMany({ _id: { $in: itemIdsToDelete } });
            // }
            return res.send({
                message: 'create success',
            })
        } catch (error) {
            return res.send({
                message: error.message
            })
        }
    },
    viewOrder: async (req,res) => {
        try {
            const user = req.user;
            const findOrder = await orderModel.find({userId:user._id}).populate({
                path:'items.itemId',
                model:'items',
                populate: {
                    path: 'productId',
                    model: 'products',
                    select: 'productName image'
                  },
            })
            res.send(findOrder)
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    },
    productDetail: async (req,res) => {
        const id = req.body;
        try {
            const product = await productModel.findById(id.id);
           res.status(200).send(product)
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    },
    productByCategory: async (req,res) => {
        const {nameCategory} = req.body;
        try {
            const categoryProduct = await productModel.find({category:nameCategory});
            res.status(200).send(categoryProduct)
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    },
    searchProduct: async (req,res) => {
        const { name } = req.params;
        try {
            const regex = new RegExp(name, "i");
        const productSearch = await productModel.find({
            productName:regex
        })
            if(productSearch.length > 0){
                res.status(200).send(productSearch)
            }else{
                res.status(404).send({message:'No product found'})
            }
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error",error:error.message });
        }
    },
    editProfile: async (req, res) => {
        try {
            const { name, phone, address, email } = req.body
            const user = req.user;
            const findUser = await userModel.findById(user._id)
            const editUser = await userModel.findByIdAndUpdate(user._id, {
                name: name || findUser.name,
                email: email || findUser.email,
                phone: phone || findUser.phone,
                address: address || findUser.address
            })
            return res.status(200).send({
                message: 'update success',
                editUser
            })
        } catch (error) {
            return res.status(400).send(error.message)
        }
    }
}
export default userController;