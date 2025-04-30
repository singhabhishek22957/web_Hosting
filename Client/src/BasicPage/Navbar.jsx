import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterPop from "../PopUpPage/RegisterPop";
import { useUser } from "../Context/UserContext";
import { FaUser } from "react-icons/fa";
import LoadingPopUp from "../Components/PopUpPage/LoadingPopUp";
import ErrorPopUp from "../PopUpPage/ErrorPopUp";
import SuccessPopUp from "../PopUpPage/SuccessPopUp";
import { logoutUser } from "../Services/UserService";
import { logoutCharity } from "../Services/CharityService";
import { useCharity } from "../Context/CharityContext";

const Navbar = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user } = useUser();
  const { charity } = useCharity();
  const dropRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if(role === 'user'){
      setUserType('user');
    } else if(role === 'charity'){
      setUserType('charity');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async(e) =>{
    e.preventDefault();
    const role = localStorage.getItem("role");
   try {
    if(role === 'user'){
        setIsLoading(true);
        const response = await logoutUser();
        console.log("response: ", response);
        localStorage.removeItem("role");
        navigate('/');
        window.location.reload();
        if (response.status === 200) {
            setSuccessMessage("Account logged out successfully!");
            setShowSuccess(true);
            // Clear user data
            console.log("User: logout" );
        }
        
    }else if(role === 'charity'){
        setIsLoading(true);
        const response = await logoutCharity();
        console.log("response: ", response);
        localStorage.removeItem("role");
        navigate('/');
        window.location.reload();
        if (response.status === 200) {
            setSuccessMessage("Account logged out successfully!");
            setShowSuccess(true);
            // Clear user data
            console.log("User: logout" );
        }
    }else{
        console.log("role not found");
        
    }
   } catch (error) {
    console.log("Error to logout: ",error);
    setShowError(true);
    setErrorMessage(error.response?.data?.message || "Failed to logout");
   }finally{
    setIsLoading(false);

   }
  }

  return (
    <header className="w-full bg-slate-700 h-16 flex items-center justify-between px-6 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <img
          src="https://img.icons8.com/ios/50/ffffff/instagram-new.png"
          alt="Logo"
          className="h-8 w-8"
        />
        <Link to="/" className="text-white text-xl font-bold">
          Food
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex gap-6">
        <Link
          to="/"
          className="text-white text-lg hover:text-yellow-300 transition"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-white text-lg hover:text-yellow-300 transition"
        >
          About
        </Link>
        <Link
          to="/charity"
          className="text-white text-lg hover:text-yellow-300 transition"
        >
          Charity
        </Link>
      </nav>

      {/* Auth Buttons */}
      {userType === 'user' ? (
        user?.name ? (
          <div className="relative" ref={dropRef}>
            <div
              className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-white cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50">
                {localStorage.getItem("role") === "user" ? (
                  <div>
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/donation/history"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Donation History
                    </Link>
                    
                    <Link
                      to="/user/settings"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Settings
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link
                      to="/charity/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/donation/history"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Donation History
                    </Link>
                    
                    <Link
                      to="/charity/settings"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Settings
                    </Link>
                  </div>
                )}
                <hr />
                <button 
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-white border border-white px-4 py-1 rounded hover:bg-white hover:text-slate-700 transition"
            >
              Login
            </Link>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-yellow-400 text-slate-800 px-4 py-1 rounded hover:bg-yellow-300 transition"
            >
              Register
            </button>
          </div>
        )
      ) : (
        charity?.name ? (
          <div className="relative" ref={dropRef}>
            <div
              className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-white cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {charity?.logoUrl ? (
                <img
                  src={charity.logoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50">
                {localStorage.getItem("role") === "user" ? (
                  <div>
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/donation/history"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Donation History
                    </Link>
                    
                    <Link
                      to="/user/settings"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Settings
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link
                      to="/charity/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/donation/history"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Donation History
                    </Link>
                    
                    <Link
                      to="/charity/settings"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Settings
                    </Link>
                  </div>
                )}
                <hr />
                <button 
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-white border border-white px-4 py-1 rounded hover:bg-white hover:text-slate-700 transition"
            >
              Login
            </Link>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-yellow-400 text-slate-800 px-4 py-1 rounded hover:bg-yellow-300 transition"
            >
              Register
            </button>
          </div>
        )
      )}
     

      {/* Register Popup */}
      <RegisterPop
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <LoadingPopUp isLoading={isLoading}  />
      <ErrorPopUp
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
      <SuccessPopUp
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={successMessage}
      />
    </header>
  );
};

export default Navbar;
