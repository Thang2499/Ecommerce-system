import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
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
    createAt:{
        Date:Date.now()
    }
})

const shopModel = mongoose.model('shops',shopSchema);

export default shopModel;