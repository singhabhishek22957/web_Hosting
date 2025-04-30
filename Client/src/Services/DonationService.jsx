import axios from "axios";

const donationService = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/donation`,
})


export const getAllDonations = async () => {
    const response = await donationService.get("/get-donation");
    return response;
}

export const registerDonation = async (data) => {
    const response = await donationService.post("/create", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    return response;
}

export const acceptedDonationByCharity = async (data)=>{
    const response = await donationService.post("/accepted-by-charity", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    return response;
}

export const getDonationById = async (data) => {
    const response = await donationService.post("/get-donation-by-id", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    return response;
}

export const acceptDonationByCharity = async (data)=>{
    const response = await donationService.post("/accepted-by-charity", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    return response;
}