



import { Schema , model }   from "mongoose";

const addressSchema = new Schema({
    officeName:{
        type:String,
        required:true,

    },
    pincode:{
        type:Number,
        required:true,
    },
    taluk:{
        type:String,
    },
    districtName:{
        type:String,
    },
    stateName:{
        type:String,
    }
},{timestamps:true})

export const Address = model("Address",addressSchema)