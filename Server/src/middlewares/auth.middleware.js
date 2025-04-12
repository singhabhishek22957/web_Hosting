import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";


 export const isAuthenticated =asyncHandler (async(req,res,next)=>{

    console.log("Checking Token................");
    // finding token 
    const token = req.cookies?.accessToken||req.header("Authorization")?.split(" ")[1]?.trim();

    console.log("Token From Cookies: ", req.cookies?.accessToken);
    console.log("Token From Header: ", req.header("Authorization"));

    // checking token if exists 
    if(!token){
        return res.status(401).json(
            new ApiResponse(401,"Unauthorized Request : Access Token not found")
        )
    }
    

    // verifying token
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token: ", decoded);

    // Fetch User Details
    const user = await User.findById({
        _id:decoded._id
    }).select("-password -refreshToken");

    if(!user){
        return res.status(401).json(
            new ApiResponse(401,"Unauthorized Request : User not found")
        )
    }

    req.user = user;
    next();
    
})