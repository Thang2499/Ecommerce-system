import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        // required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        // required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      unitPrice: {
        type: Number,
        required: true
      },
      totalPrice: {
        type: Number,
        // required: true
      }
})
const itemModel = mongoose.model('items', itemSchema);
export default itemModel;