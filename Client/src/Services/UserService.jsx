import axios from "axios";

const userService = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/user`,
});

export const registerUser = async (data) => {
  const response = await userService.post("/register", data, {
    headers: { "Content-Type": "application/json" },
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
