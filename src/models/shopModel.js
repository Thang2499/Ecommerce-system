import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:true
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orders'
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    description:{
        type:String
    },
    role:{
        type:String,
        require:true
    },
    address:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:false
    },
    createAt:{
        Date:Date.now(),
        type:String
    }
})

const shopModel = mongoose.model('shops',shopSchema);

export default shopModel;