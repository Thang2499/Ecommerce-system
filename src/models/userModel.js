import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'shops'
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        default:'custumer'
    },
    phone:{
        type:String,
        // require:true
    },
    address:{
        type:String
    },
    gender:{
        type:String
    },
    wishlist: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
          }
        }
      ],
    cart: [
        {
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'items'
          },
          // quantity: {
          //   type: Number,
          //   default: 1
          // },
          // unitPrice: Number,
          // totalPrice: Number
        }
      ],
})

const userModel = mongoose.model('users',userSchema);

export default userModel;