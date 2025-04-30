import { Address } from "../models/address.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const getAddressByPincode = asyncHandler(async (req,res)=>{
    const {pincode} = req.body;
    console.log("Pincode: ", pincode);
    
    if(!pincode){
        return res.status(400).json({
            success:false,
            message:"Pincode is required"
        })
    }

    const address = await Address.find({
        pincode:pincode
    }).sort({
        officeName:1
    })
    console.log("Pincode: ", pincode);
    
    console.log("Address: ", address);
    

    if(address.length === 0){
        console.log("Address not found");
        
        const response = res.status(404).json( 
            new ApiResponse(404,"Address not found",{
                message:"Address not found",
                statusCode:404,
                success:false
            })
        )
        console.log("Response: ", response);
        
        return response
        
    }
    console.log("Address: ", address);
    return res.status(200).json(
        new ApiResponse(200,"Address Found",{
            message:"Address Found",
            statusCode:200,
            success:true,
            address:address
        })
    )
    
})

export {
    getAddressByPincode
}