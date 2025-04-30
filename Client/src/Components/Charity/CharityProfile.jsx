import React, { useState } from 'react';
import { FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaCamera, FaImage, FaFileAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { updateCharity, deleteCharity } from '../../Services/CharityService';
import { useCharity } from '../../Context/CharityContext';
import LoadingPopUp from '../PopUpPage/LoadingPopUp';
import ErrorPopUp from '../PopUpPage/ErrorPopUp';
import SuccessPopUp from '../PopUpPage/SuccessPopUp';

const CharityProfile = () => {
    const { charity, setCharity, fetchCharity } = useCharity();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [logo, setLogo] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [logoPreview, setLogoPreview] = useState(charity?.logoUrl || null);
    const [coverPreview, setCoverPreview] = useState(charity?.coverImage || null);
    const [formData, setFormData] = useState({
        name: charity?.name || '',
        description: charity?.description || '',
        mission: charity?.mission || '',
        vision: charity?.vision || '',
        founderName: charity?.founderName || '',
        establishedDate: charity?.establishedDate || '',
        registeredNGO: charity?.registeredNGO || false,
        registrationNumber: charity?.registrationNumber || '',
        panNumber: charity?.panNumber || '',
        email: charity?.email || '',
        phoneNumbers: charity?.phoneNumbers || [''],
        website: charity?.website || '',
        socialLinks: {
            facebook: charity?.socialLinks?.facebook || '',
            twitter: charity?.socialLinks?.twitter || '',
            instagram: charity?.socialLinks?.instagram || '',
            linkedin: charity?.socialLinks?.linkedin || '',
            youtube: charity?.socialLinks?.youtube || ''
        },
        address: {
            addressType: charity?.address?.addressType || 'office',
            addressLine1: charity?.address?.addressLine1 || '',
            addressLine2: charity?.address?.addressLine2 || '',
            flatNumber: charity?.address?.flatNumber || '',
            landmark: charity?.address?.landmark || '',
            city: charity?.address?.city || '',
            state: charity?.address?.state || '',
            pincode: charity?.address?.pincode || ''
        }
    });

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'logo') {
                setLogo(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (type === 'cover') {
                setCoverImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCoverPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handlePhoneChange = (index, value) => {
        const newPhoneNumbers = [...formData.phoneNumbers];
        newPhoneNumbers[index] = value;
        setFormData(prev => ({
            ...prev,
            phoneNumbers: newPhoneNumbers
        }));
    };

    const addPhoneNumber = () => {
        setFormData(prev => ({
            ...prev,
            phoneNumbers: [...prev.phoneNumbers, '']
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const formDataToSend = new FormData();
            
            // Append all form data
            Object.keys(formData).forEach(key => {
                if (key === 'socialLinks' || key === 'address') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (key === 'phoneNumbers') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append files if they exist
            if (logo) formDataToSend.append('logo', logo);
            if (coverImage) formDataToSend.append('coverImage', coverImage);

            const response = await updateCharity(formDataToSend);

            if (response.status === 200) {
                setSuccessMessage("Profile updated successfully!");
                setShowSuccess(true);
                setIsEditing(false);
                // Refresh charity data
                await fetchCharity();
            } else {
                setErrorMessage(response.data.message || "Failed to update profile");
                setShowError(true);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to update profile");
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setIsLoading(true);
            const response = await deleteCharity(charity?._id);
            if (response.status === 200) {
                setSuccessMessage("Account deleted successfully!");
                setShowSuccess(true);
                // Clear charity data
                setCharity(null);
                // Clear local storage
                localStorage.removeItem("role");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setErrorMessage(response.data.message || "Failed to delete account");
                setShowError(true);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to delete account");
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative h-64 bg-gradient-to-r from-green-500 to-green-600">
                        {/* Cover Image */}
                        <div className="absolute inset-0">
                            {coverPreview ? (
                                <img 
                                    src={coverPreview} 
                                    alt="Cover" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <FaImage className="text-4xl text-gray-400" />
                                </div>
                            )}
                            {isEditing && (
                                <label className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-xl cursor-pointer hover:bg-green-600 flex items-center gap-2">
                                    <FaCamera />
                                    <span>Change Cover</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'cover')}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        
                        {/* Logo */}
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                {logoPreview ? (
                                    <img 
                                        src={logoPreview} 
                                        alt="Logo" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <FaBuilding className="text-4xl text-gray-400" />
                                    </div>
                                )}
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600">
                                        <FaCamera />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'logo')}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Edit/Save Buttons */}
                        <div className="absolute bottom-4 right-4">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <FaSave /> Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
                                >
                                    <FaEdit /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 pb-8 px-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Organization Information */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-bold text-green-600 mb-4">Organization Information</h2>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100 h-32"
                                    />
                                    <textarea
                                        name="mission"
                                        value={formData.mission}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100 h-32"
                                    />
                                    <textarea
                                        name="vision"
                                        value={formData.vision}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100 h-32"
                                    />
                                </div>
                            </div>

                            {/* Legal Information */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-bold text-green-600 mb-4">Legal Information</h2>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="founderName"
                                            value={formData.founderName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        name="establishedDate"
                                        value={formData.establishedDate}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="registeredNGO"
                                            checked={formData.registeredNGO}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="rounded text-green-500"
                                        />
                                        <label className="text-gray-700">Registered NGO</label>
                                    </div>
                                    <div className="relative">
                                        <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="registrationNumber"
                                            value={formData.registrationNumber}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={formData.panNumber}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-bold text-green-600 mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        {formData.phoneNumbers.map((phone, index) => (
                                            <div key={index} className="relative">
                                                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                                                    disabled={!isEditing}
                                                    className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                                />
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={addPhoneNumber}
                                                className="text-green-500 hover:text-green-600 text-sm flex items-center gap-1"
                                            >
                                                <FaPhone className="text-xs" /> Add Another Phone Number
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-bold text-green-600 mb-4">Address</h2>
                                <div className="space-y-4">
                                    <select
                                        name="address.addressType"
                                        value={formData.address.addressType}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                    >
                                        <option value="office">Office</option>
                                        <option value="branch">Branch</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="address.addressLine1"
                                            value={formData.address.addressLine1}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="address.addressLine2"
                                        value={formData.address.addressLine2}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="address.flatNumber"
                                            value={formData.address.flatNumber}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                        <input
                                            type="text"
                                            name="address.landmark"
                                            value={formData.address.landmark}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={formData.address.city}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={formData.address.state}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                        <input
                                            type="text"
                                            name="address.pincode"
                                            value={formData.address.pincode}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-xl font-bold text-green-600 mb-4">Social Media</h2>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            name="socialLinks.facebook"
                                            value={formData.socialLinks.facebook}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            name="socialLinks.twitter"
                                            value={formData.socialLinks.twitter}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            name="socialLinks.instagram"
                                            value={formData.socialLinks.instagram}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            name="socialLinks.linkedin"
                                            value={formData.socialLinks.linkedin}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaYoutube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            name="socialLinks.youtube"
                                            value={formData.socialLinks.youtube}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full border-2 border-gray-200 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
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
};

export default CharityProfile;
