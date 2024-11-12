import mongoose from "mongoose";
const productSchema = new Schema({
    shopId:{
        type: mongoose.Schema.Types.ObjectId,
        require:true
    },
    productName: {
      type: String,
      required: true
    },
    category:{
        type:String
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    salePrice: Number,
    discount: Number,
    image: String, 
    imageDetail: [String], 
    stock: {
      type: Number,
      default: 0
    },
  });
  
 const productModel = mongoose.model('products', productSchema);
 export default productModel;
  