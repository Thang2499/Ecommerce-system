import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    shopId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shops',
        require:true
    },
    productName: {
      type: String,
      required: true
    },
    category:{
        type:String,
        require:true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    salePrice: Number,
    discount: Number,
    image: [String], 
    imageDetail: [String], 
    stock: {
      type: Number,
      default: 0
    },
  },{collection:'products'});
  
 const productModel = mongoose.model('products', productSchema);
 export default productModel;
  