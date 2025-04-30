import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Charity } from "../models/charity.models.js";


 export const isUserAuthenticated =asyncHandler (async(req,res,next)=>{

    console.log("Checking Token................");
    // finding token 
    const token = req.cookies?.accessToken||req.header("Authorization")?.split(" ")[1]?.trim();

    console.log("Token From Cookies: ", req.cookies?.accessToken);
    console.log("Token From Header: ", req.header("Authorization"));
    console.log("Token: ",token);
    

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


export const isCharityAuthenticate = asyncHandler(async (req, res, next) => {
    console.log("Checking Token Details...");

    const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1]?.trim();

    console.log("Token from Cookies:", req.cookies?.accessToken);
    console.log("Token from Header:", req.header("Authorization"));
    console.log("Extracted Token:", token);

    // Check if token exists
    if (!token) {
        return res.status(401).json(
            new ApiResponse(401, "Unauthorized Request: Access Token not found")
        );
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decoded);

        // Fetch charity details
        const charity = await Charity.findById(decoded._id).select("-password -refreshToken");

        if (!charity) {
            return res.status(400).json(new ApiResponse(400, "Charity not found: Unauthorized Access"));
        }

        // Attach charity to request object
        req.charity = charity;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json(
            new ApiResponse(401, "Invalid or expired token")
        );
    }
});
