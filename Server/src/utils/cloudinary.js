import {v2 as cloudinary} from 'cloudinary'

import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const uploadOnCloudinary = async(localFilePath)=>{
    if(!localFilePath) return null;

    try {
        // upload 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        });
    
        fs.unlinkSync(localFilePath);
        // file upload on cloudinary
        console.log("File uploaded on cloudinary: ", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("Error while uploading file on cloudinary: ", error);
        return null
        
    }
}

export default uploadOnCloudinary