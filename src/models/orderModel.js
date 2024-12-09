import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'items',
                required: true
            }
        }
    ],
    shopId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'shops',
        required: true },
        
      date: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['Pending','Delivering', 'Completed', 'Canceled'],
        default: 'Pending'
      },
      totalAmount: {
        type: Number,
        required: true
      },
      paymentMethod: {
        type: String,
        enum: ['Momo', 'Cash on Delivery', 'Paypal'],
        required: true
      },
      shippingAddress: {
        type: String
      }
});
const orderModel = mongoose.model('orders',orderSchema);
export default orderModel;