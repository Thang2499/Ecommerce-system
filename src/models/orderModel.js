import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      itemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items',
        // required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['Pending', 'Completed', 'Shipped', 'Canceled'],
        default: 'Pending'
      },
      totalAmount: {
        type: Number,
        required: true
      },
      paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Cash on Delivery', 'Paypal'],
        required: true
      },
      shippingAddress: {
        type: String
      }
});
const orderModel = mongoose.model('orders',orderSchema);
export default orderModel;