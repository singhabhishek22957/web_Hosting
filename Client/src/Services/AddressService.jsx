import axios from "axios";

const addressService = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/address`,

});

export const getAddressByPincode = async (pincode)=>{
    console.log("Pincode: ", pincode);
    
    const response = await addressService.post("/address-by-pincode", pincode,{
        headers:{'Content-Type':'application/json'},
        withCredentials:true
    });
    console.log("getAddressByPincode: ", response);
    

    return response;
}