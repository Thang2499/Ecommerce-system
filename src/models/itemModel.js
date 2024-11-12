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
        required: true
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
        required: true
      }
})
export default itemSchema;