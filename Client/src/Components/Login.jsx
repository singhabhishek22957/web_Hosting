import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaBuilding,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
} from "react-icons/fa";
import { loginUser } from "../Services/UserService";
import LoadingPopUp from "../PopUpPage/LoadingPopUp";
import ErrorPopUp from "../PopUpPage/ErrorPopUp";
import { loginCharity } from "../Services/CharityService";
import SuccessPopUp from "../PopUpPage/SuccessPopUp";
import { useUser } from "../Context/UserContext";
import { useCharity } from "../Context/CharityContext";

const LoginPage = () => {
  const { fetchUser } = useUser();
  const { fetchCharity } = useCharity();
 
  // for loadingPOPUP
  const [isLoading, setIsLoading] = useState(false);
  //   for errorPOPUP
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // for tabs
  const [activeTab, setActiveTab] = useState("user");

  // for password show
  const [showPassword, setShowPassword] = useState(false);

  //  user data
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  // charity data
  const [charityData, setCharityData] = useState({
    email: "",
    password: "",
  });

  //store errors
  const [errors, setErrors] = useState({
    user: { email: "", password: "" },
    charity: { email: "", password: "" },
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  //   handle input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "user") {
      setUserData({ ...userData, [name]: value });
      // Clear error when user starts typing
      if (value.trim() !== "") {
        setErrors((prev) => ({
          ...prev,
          user: { ...prev.user, [name]: "" },
        }));
      }
    } else {
      setCharityData({ ...charityData, [name]: value });
      // Clear error when user starts typing
      if (value.trim() !== "") {
        setErrors((prev) => ({
          ...prev,
          charity: { ...prev.charity, [name]: "" },
        }));
      }
    }
  };

  // validate form data
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!data.password.trim()) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === "user") {
      
      const userErrors = validateForm(userData);
      if (Object.keys(userErrors).length > 0) {
        setErrors((prev) => ({
          ...prev,
          user: userErrors,
        }));
        return;
      }
      try {
        setIsLoading(true);
        const userResponse = await loginUser({
          email: userData.email,
          password: userData.password,
        });

        if (userResponse.data.success) {
          // Handle successful login
          console.log("Login successful:", userResponse.data);
          setIsSuccess(true);
          setSuccessMessage(userResponse.data.message);

         
          // set role in local storage
          localStorage.setItem("role", activeTab);
          // if(localStorage.getItem('role')==='user'){
          //   const {fetchUser} = useUser();
          //   await fetchUser();
          // }
          await fetchUser();
          navigate("/");
        window.location.reload();


        } else {
          setErrorMessage(
            userResponse.data.message || "Login failed. Please try again."
          );
          setShowError(true);
        }
      } catch (error) {
        console.error("Login error:", error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message); // show server error
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      const charityErrors = validateForm(charityData);
      if (Object.keys(charityErrors).length > 0) {
        setErrors((prev) => ({
          ...prev,
          charity: charityErrors,
        }));
        return;
      }
      // Handle charity login logic here
      console.log("Charity login data:", charityData);
      try {
        setIsLoading(true);
        const charityResponse = await loginCharity({
          email: charityData.email,
          password: charityData.password,
        });

        if (charityResponse.data.success) {
          // Handle successful login
          console.log("Login successful:", charityResponse.data);
          setIsSuccess(true);
          setSuccessMessage(charityResponse.data.message);
         
          // set role in local storage
          localStorage.setItem("role", activeTab);
          // if(localStorage.getItem("role")==='charity'){
          //   const {fetchCharity} = useCharity();
          //    // fetch charity context
          //    await fetchCharity();
          // }
          await fetchCharity();
          navigate("/");
        window.location.reload();
        } else {
          setErrorMessage(
            charityResponse.data.message || "Login failed. Please try again."
          );
          setShowError(true);
        }
      } catch (error) {
        console.error("Login error:", error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message); // show server error
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden p-8 transform transition-all duration-500 hover:scale-[1.01]">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-l-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "user"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("user")}
          >
            <FaUser className="text-lg" />
            User Login
          </button>
          <button
            className={`px-6 py-2 rounded-r-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "charity"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("charity")}
          >
            <FaBuilding className="text-lg" />
            Charity Login
          </button>
        </div>

        {/* Forms */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === "user" ? (
            // User Login
            <form
              className="space-y-4 max-w-xs mx-auto"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                Welcome Back!
              </h2>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`w-full border-2 ${
                    errors.user.email ? "border-red-500" : "border-gray-200"
                  } px-10 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  *
                </span>
                {errors.user.email && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <FaExclamationCircle className="mr-1" />
                    {errors.user.email}
                  </div>
                )}
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full border-2 ${
                    errors.user.password ? "border-red-500" : "border-gray-200"
                  } px-10 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300`}
                />
                <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500">
                  *
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.user.password && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <FaExclamationCircle className="mr-1" />
                    {errors.user.password}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-600">
                  <input type="checkbox" className="rounded text-blue-500" />
                  <span>Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
              >
                Login
              </button>
            </form>
          ) : (
            // Charity Login
            <form
              className="space-y-4 max-w-xs mx-auto"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
                Charity Organization
              </h2>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={charityData.email}
                  onChange={handleChange}
                  placeholder="Organization Email"
                  className={`w-full border-2 ${
                    errors.charity.email ? "border-red-500" : "border-gray-200"
                  } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  *
                </span>
                {errors.charity.email && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <FaExclamationCircle className="mr-1" />
                    {errors.charity.email}
                  </div>
                )}
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={charityData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full border-2 ${
                    errors.charity.password
                      ? "border-red-500"
                      : "border-gray-200"
                  } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                />
                <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500">
                  *
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.charity.password && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <FaExclamationCircle className="mr-1" />
                    {errors.charity.password}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-600">
                  <input type="checkbox" className="rounded text-green-500" />
                  <span>Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-green-500 hover:text-green-600 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </div>

      <LoadingPopUp isLoading={isLoading} />
      <ErrorPopUp
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
        title="Login Error"
      />
      <SuccessPopUp isOpen={isSuccess} onClose={()=>{
        if(activeTab === "user"){
          setIsSuccess(false);
          navigate("/");
        }else if(activeTab === "charity"){  
          setIsSuccess(false);
          navigate("/");
        }
      }} message={successMessage} />
    </div>
  );
};

export default LoginPage;


