import axios from "axios";

const userService = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/user`,
});

export const registerUser = async (data) => {
  const response = await userService.post("/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return response;
};
export const loginUser = async (data) => {
  const response = await userService.post("/login", data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response;
};

export const getUser = async () =>{
  const response = await userService.get("/get-user",{
    withCredentials:true
  })

  return response
}

export const logoutUser = async () => {
  const response = await userService.get("/logout", {
    withCredentials: true,
  });
  return response;
}

export const getDonationHistory = async (data) => {
  const response = await userService.post("/donation-history",data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response;
}
