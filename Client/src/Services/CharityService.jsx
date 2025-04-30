import axios from "axios";
import ErrorPopUp from "../PopUpPage/ErrorPopUp";

const charityService = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/charity`,
});

export const registerCharity = async (data) => {
  const response = await charityService.post("/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return response;
};

export const loginCharity = async (data) => {
  const response = await charityService.post("/login", data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response;
};

export const getCharity = async () => {
  const response = await charityService.get("/get-charity", {
    withCredentials: true
  });
  return response;
};

export const logoutCharity = async () => {
  const response = await charityService.get("/logout", {
    withCredentials: true,
  });
  return response;
};

export const updateCharity = async (data) => {
  const response = await charityService.put("/update-charity", data, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return response;
};

export const deleteCharity = async (charityId) => {
  const response = await charityService.delete(`/delete-charity/${charityId}`, {
    withCredentials: true,
  });
  return response;
};

export const getCharityDonationHistory = async (data)=>{
  const response = await charityService.post("/donation-history",data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response;
}