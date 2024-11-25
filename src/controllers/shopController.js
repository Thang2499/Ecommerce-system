import { json } from "express";
import { decodeToken } from "../middleware/createjwt.js";
import productModel from "../models/productModel.js";
import shopModel from "../models/shopModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'del1bdorn',
    api_key: '648793695735266',
    api_secret: 'xjK4i1bEVQIQV1TJ5a6nInR3RDs'
});
const shopController = {
    register: async (req, res) => {
        try {
            const user = req.user;
            const { name, phone } = req.body;
            const registerShop = await shopModel.create({
                userId: user._id,
                name: name,
                email: user.email,
                phone: phone,
                role: 'shop'
            })
            const creatIdShop = await shopModel.findOne({ email: user.email })
            const shopId = await userModel.findByIdAndUpdate(user._id, { shopId: creatIdShop._id })
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
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).send({ message: 'Access denied, no token provided' });
            }
            const decoded = decodeToken(token);
            const shopInfo = await shopModel.findById(decoded.user.shopId);
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
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).send({ message: 'Access denied, no token provided' });
            }
            const decoded = decodeToken(token);
            const getListProduct = await productModel.find({ shopId: decoded.user.shopId });
            console.log(getListProduct)
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
            const { productName, category, price } = req.body;
            const listFile = req.files;
            const token = req.cookies.token;

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
            if (!token) {
                return res.status(401).send({ message: 'Access denied, no token provided' });
            }
            const decoded = decodeToken(token);
            req.user = decoded.user;
            const addProduct = await productModel.create({
                shopId: req.user.shopId,
                productName: productName,
                category: category,
                price: price,
                imageDetail: listResult
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
            const listFile = req.files['files']; 
            const file = req.file
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: 'Access denied, no token provided' });
            }
            const decoded = decodeToken(token);
            req.user = decoded.user;

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
            // let updatedImage = existingProduct.image;
            // if (imageUrlsToDelete) {
            //     const publicId = extractPublicIdFromUrl(JSON.parse(imageUrlsToDelete));
            
            //     // Xóa ảnh trên Cloudinary
            //     await cloudinary.uploader.destroy(publicId);

            //     updatedImage = ''; 
            // }

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
            const { id } = req.params;
            const deleteProduct = await productModel.findByIdAndDelete(id);
            res.status(200).send({
                message: ' delete success',
                deleteProduct
            })
        } catch (err) {
            res.status(400).send({
                message: err.message
            })
        }
    }
}
export default shopController;