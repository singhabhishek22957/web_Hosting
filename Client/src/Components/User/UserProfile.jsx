import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaVenusMars, FaBriefcase, FaEdit, FaTrash, FaCamera, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorPopUp from "../PopUpPage/ErrorPopUp";
import SuccessPopUp from "../PopUpPage/SuccessPopUp";
import LoadingPopUp from "../PopUpPage/LoadingPopUp";
import { useUser } from "../../Context/UserContext";
import { logoutUser } from "../../Services/UserService";

export default function UserProfile() {
    const { user, setUser, fetchUser } = useUser();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    console.log("User Profile: ", user);
    
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        dateOfBirth: user?.dateOfBirth || "",
        gender: user?.gender || "",
        occupation: user?.occupation || "",
        profilePicture: user?.avatarUrl,
        socialLinks: {
            facebook: user?.socialLinks?.facebook || "",
            twitter: user?.socialLinks?.twitter || "",
            instagram: user?.socialLinks?.instagram || "",
            linkedin: user?.socialLinks?.linkedin || ""
        }
    });

    const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profilePicture: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        //     setIsLoading(true);
        //     const response = await updateUser({
        //         ...formData,
        //         userId: user?._id
        //     });

        //     if (response.status === 200) {
        //         setSuccessMessage("Profile updated successfully!");
        //         setShowSuccess(true);
        //         setIsEditing(false);
        //         // Refresh user data
        //         await fetchUser();
        //     } else {
        //         setErrorMessage(response.data.message || "Failed to update profile");
        //         setShowError(true);
        //     }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to update profile");
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            // setIsLoading(true);
            // const response = await deleteUser(user?._id);
            // if (response.status === 200) {
            //     setSuccessMessage("Account deleted successfully!");
            //     setShowSuccess(true);
            //     // Clear user data
            //     setUser(null);
            //     // Clear local storage
            //     localStorage.removeItem("role");
            //     setTimeout(() => {
            //         navigate('/login');
            //     }, 2000);
            // } else {
            //     setErrorMessage(response.data.message || "Failed to delete account");
            //     setShowError(true);
            // }

            const response = await logoutUser();
            console.log("response: ", response);
            if (response.status === 200) {
                setSuccessMessage("Account deleted successfully!");
                setShowSuccess(true);
                // Clear user data
                console.log("User: logout" );
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to delete account");
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative h-48 bg-gradient-to-r from-green-500 to-blue-500">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <FaUser className="text-4xl text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-all duration-300">
                                        <FaCamera />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white text-green-500 px-4 py-2 rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <FaEdit /> Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="bg-white text-red-500 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <FaTrash /> Delete Account
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-white text-gray-500 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all duration-300"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 pb-8 px-8">
                        {isEditing ? (
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email Address"
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="occupation"
                                            value={formData.occupation}
                                            onChange={handleChange}
                                            placeholder="Occupation"
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Social Media Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                name="socialLinks.facebook"
                                                value={formData.socialLinks.facebook}
                                                onChange={handleChange}
                                                placeholder="Facebook URL"
                                                className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                            />
                                        </div>
                                        <div className="relative">
                                            <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                name="socialLinks.twitter"
                                                value={formData.socialLinks.twitter}
                                                onChange={handleChange}
                                                placeholder="Twitter URL"
                                                className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                            />
                                        </div>
                                        <div className="relative">
                                            <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                name="socialLinks.instagram"
                                                value={formData.socialLinks.instagram}
                                                onChange={handleChange}
                                                placeholder="Instagram URL"
                                                className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                            />
                                        </div>
                                        <div className="relative">
                                            <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                name="socialLinks.linkedin"
                                                value={formData.socialLinks.linkedin}
                                                onChange={handleChange}
                                                placeholder="LinkedIn URL"
                                                className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-4">
                                        <FaUser className="text-2xl text-green-500" />
                                        <div>
                                            <h3 className="text-sm text-gray-500">Full Name</h3>
                                            <p className="text-lg font-semibold">{user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FaEnvelope className="text-2xl text-green-500" />
                                        <div>
                                            <h3 className="text-sm text-gray-500">Email</h3>
                                            <p className="text-lg font-semibold">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FaPhone className="text-2xl text-green-500" />
                                        <div>
                                            <h3 className="text-sm text-gray-500">Phone</h3>
                                            <p className="text-lg font-semibold">{user?.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FaBirthdayCake className="text-2xl text-green-500" />
                                        <div>
                                            <h3 className="text-sm text-gray-500">Date of Birth</h3>
                                            <p className="text-lg font-semibold">{user?.dateOfBirth}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FaVenusMars className="text-2xl text-green-500" />
                                        <div>
                                            <h3 className="text-sm text-gray-500">Gender</h3>
                                            <p className="text-lg font-semibold capitalize">{user?.gender}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FaBriefcase className="text-2xl text-green-500" />
                                        <div>
                                            <h3 className="text-sm text-gray-500">Occupation</h3>
                                            <p className="text-lg font-semibold">{user?.occupation}</p>
                                        </div>
                                    </div>
                                </div>

                                {user?.address && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Address</h3>
                                        <div className="flex items-start gap-4">
                                            <FaMapMarkerAlt className="text-2xl text-green-500 mt-1" />
                                            <div>
                                                <p className="text-lg font-semibold">{user.address.addressLine1}</p>
                                                {user.address.addressLine2 && (
                                                    <p className="text-gray-600">{user.address.addressLine2}</p>
                                                )}
                                                <p className="text-gray-600">
                                                    {user.address.city}, {user.address.state} - {user.address.pincode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {user?.socialLinks && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Social Media</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {user.socialLinks.facebook && (
                                                <a
                                                    href={user.socialLinks.facebook}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                                >
                                                    <FaFacebook /> Facebook
                                                </a>
                                            )}
                                            {user.socialLinks.twitter && (
                                                <a
                                                    href={user.socialLinks.twitter}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-400 hover:text-blue-500"
                                                >
                                                    <FaTwitter /> Twitter
                                                </a>
                                            )}
                                            {user.socialLinks.instagram && (
                                                <a
                                                    href={user.socialLinks.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                                                >
                                                    <FaInstagram /> Instagram
                                                </a>
                                            )}
                                            {user.socialLinks.linkedin && (
                                                <a
                                                    href={user.socialLinks.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-700 hover:text-blue-800"
                                                >
                                                    <FaLinkedin /> LinkedIn
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-red-600 mb-4">Delete Account</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <LoadingPopUp isLoading={isLoading} />
            <ErrorPopUp
                isOpen={showError}
                onClose={() => setShowError(false)}
                message={errorMessage}
                title="Error"
            />
            <SuccessPopUp
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                message={successMessage}
                title="Success"
            />
        </div>
    );
}

