import productModel from "../models/productModel.js";
import shopModel from "../models/shopModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto'
import axios from "axios";
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name: 'del1bdorn',
    api_key: process.env.CLOUNDINARY,
    api_secret: process.env.CLOUNDINARY_SECRET_API
});
const shopController = {
    register: async (req, res) => {
        try {
            const user = req.user;
            const { shopName, phoneNumber,description, address } = req.body;
            const registerShop = await shopModel.create({
                userId: user._id,
                name: shopName,
                email: user.email,
                phone: phoneNumber,
                description:description,
                address:address,
                role: 'shop'
            })
            const creatIdShop = await shopModel.findOne({ email: user.email })
            const shopId = await userModel.findByIdAndUpdate(user._id, { shopId: creatIdShop._id })
            if(registerShop.isActive === false){
              return res.send({
                    message:"Đang chờ duyệt"
                })
            }
            res.status(200).send({
                message: 'create Shop success',
                registerShop,
                shopId
            })
        } catch (err) {
            res.status(400).send({
                message: err.message
            })
        }
    },
    getShop: async (req, res) => {
        try {
            const users = req.user
            // const token = req.cookies.token;

            // if (!token) {
            //     return res.status(401).send({ message: 'Access denied, no token provided' });
            // }
            // const decoded = decodeToken(token);
            const shopInfo = await shopModel.findById(users.shopId);
            res.status(200).send({
                shopInfo
            })
        } catch (err) {
            res.status(400).send({
                message: err.message
            })
        }
    },
    productList: async (req, res) => {
        try {
            // const token = req.cookies.token;

            // if (!token) {
            //     return res.status(401).send({ message: 'Access denied, no token provided' });
            // }
            // const decoded = decodeToken(token);
            const users = req.user
            const getListProduct = await productModel.find({ shopId: users.shopId });
            if (!getListProduct) {
                return res.status(400).send({
                    message: 'hiện chưa có sản phẩm nào'
                })
            }
            return res.send({
                getListProduct
            })
        } catch (err) {
            res.status(400).send({
                message: err.message
            })
        }
    },
    addProduct: async (req, res) => {
        try {
            const { productName, category, price,Des } = req.body;
            const listFile = req.files;
            // const token = req.cookies.token;
            if (!listFile || listFile.length === 0) {
                return res.status(400).json({ error: 'Không có tệp nào được tải lên.' });
            }
            const listResult = await Promise.all(
                listFile.map(async (file) => {
                    try {
                        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                        const fileName = file.originalname.split('.')[0];

                        const result = await cloudinary.uploader.upload(dataUrl, {
                            public_id: fileName,
                            resource_type: 'auto',
                        });

                        return result.secure_url;
                    } catch (error) {
                        console.error(`Lỗi khi tải file ${file.originalname}:`, error);
                        return null;
                    }
                })
            );

            //    const imageDetails = cloudinary.uploader.upload(dataUrl, {
            //         public_id: fileName,
            //         resource_type: 'auto',
            //         // có thể thêm field folder nếu như muốn tổ chức
            //     }, (err, result) => {
            //         if (result) {
            //            listResult.push(result);
            //         }
            //     });
            // }
            // if (!token) {
            //     return res.status(401).send({ message: 'Access denied, no token provided' });
            // }
            // const decoded = decodeToken(token);
            // req.user = decoded.user;
            const user = req.user
            const addProduct = await productModel.create({
                shopId: user.shopId,
                productName: productName,
                category: category,
                price: price,
                image: listResult,
                description:Des
            })
            return res.status(200).send({
                message: 'add product success',
                addProduct
            })
        } catch (err) {
            res.status(400).send({
                message: err.message
            })
        }

    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.query;
            const { productName, category, price, imageUrlsToDelete } = req.body;
            const listFile = req.files; 
            // const file = req.file['file']

            // const token = req.cookies.token;
            // if (!token) {
            //     return res.status(401).json({ message: 'Access denied, no token provided' });
            // }
            // const decoded = decodeToken(token);
            //  req.user = decoded.user;

            const existingProduct = await productModel.findById(id);
            if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            const extractPublicIdFromUrl = (url) => {
                const parts = url.split('/');
                const publicIdWithExtension = parts[parts.length - 1];
                const publicId = publicIdWithExtension.split('.')[0];
                return publicId;
            };
            // if (!file || file.length === 0) {
            //     return res.status(400).json({ error: 'Không có tệp nào được tải lên.' });
            // }
            // if (file) { 
            //     try {
            //         const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`; 
            //         const fileName = req.file.originalname.split('.')[0]; 
            
            //         const result = await cloudinary.uploader.upload(dataUrl, {
            //             public_id: fileName,
            //             resource_type: 'auto',
            //         });
            
            //         updatedImage = result.secure_url; 
            //     } catch (error) {
            //         console.error(`Lỗi khi tải file ${req.file.originalname}:`, error);
            //         throw new Error('Upload file thất bại'); 
            //     }
            // }
            // let updatedImage = existingProduct.imageDetail;
            // if (imageUrlsToDelete) {
            //     const urlsToDelete = JSON.parse(imageUrlsToDelete);

            //     // Xóa từng ảnh trên Cloudinary
            //     await Promise.all(
            //         urlsToDelete.map(async (url) => {
            //             const publicId = extractPublicIdFromUrl(url);
            //             await cloudinary.uploader.destroy(publicId);
            //         })
            //     );

            //     updatedImage = updatedImage.filter((url) => !urlsToDelete.includes(url));
            // }
            let updatedImages = existingProduct.imageDetail;
            if (listFile && listFile.length > 0) {
                const newImages = await Promise.all(
                    listFile.map(async (file) => {
                        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                        const fileName = file.originalname.split('.')[0];
                        const result = await cloudinary.uploader.upload(dataUrl, {
                            public_id: fileName,
                            resource_type: 'auto',
                        });
                        return result.secure_url;
                    })
                );
                updatedImages = [...updatedImages, ...newImages];
            }
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                {
                    productName: productName || existingProduct.productName,
                    category: category || existingProduct.category,
                    price: price || existingProduct.price,
                    // image: updatedImage,
                    imageDetail: updatedImages,
                },
                { new: true } 
            );
            res.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct,
            });
        } catch (err) {
            res.status(400).send({
                message: err.message
            })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { productId } = req.body;
            const user = req.user
            const product = await productModel.findById(productId)
            if(user.shopId._id.toString() !== product.shopId.toString()){
                return res.status(400).send('Bạn không có quyền xóa sản phẩm này')
            }
            const deleteProduct = await productModel.findByIdAndDelete(productId);
            if(!deleteProduct){
                res.status(404).send('Product not found')
            }
            res.status(200).send({
                message: ' delete success',
            })
        } catch (err) {
            res.status(400).send({
                message: err.message
            })
        }
    },
    manageOrder: async (req,res) => {
        try {
            const user = req.user;
            const findShop = await orderModel.find({shopId:user.shopId}).populate({
                path:'items.itemId',
                model:'items',
                populate: {
                    path: 'productId',
                    model: 'products',
                    select: 'productName image'
                  },
            }).populate({
                path:'userId',
                model:'users',
                select:'name phone'
            });
            res.send(findShop)
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    },
    updateOrder: async (req,res) =>{
        try {
            const {newStatus} = req.body;
            const orderId = req.params;
            const updateStatus = await orderModel.findByIdAndUpdate(orderId.orderId,{
                status:newStatus
            })
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    paymentMethod: async (req, res) => {
        const { amountPayment } = req.body; 
        if (!amountPayment || isNaN(amountPayment)) {
            return res.status(400).json({ message: 'Total is required and should be a number' });
        }
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = 'http://localhost:5173/';
        var ipnUrl = 'http://localhost:5173/';
        var requestType = "payWithMethod";
        var amount = Number(amountPayment);
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        var extraData = '';
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';
        console.log("Raw Signature:", amount);
        //before sign HMAC SHA256 with format
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
      
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        // console.log("--------------------SIGNATURE----------------")
        // console.log(signature)
    
        //json object send to MoMo endpoint
        const requestBody = {
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        };
        const options = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody
        };
        
        let result;
        try {
            result = await axios(options);
            return res.json(result.data);
        } catch (error) {
            console.error("Error occurred: ", error);
            return res.status(500).json({
                statusCode: 500,
                message: "Server lỗi",
                error: error.response ? error.response.data : error.message
            });
        }
    }
}
export default shopController;