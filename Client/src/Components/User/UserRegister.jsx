import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaArrowRight, FaCheck, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCamera, FaExclamationCircle } from 'react-icons/fa';
import ErrorPopUp from '../../PopUpPage/ErrorPopUp';
import LoadingPopUp from '../../PopUpPage/LoadingPopUp';
import SuccessPopUp from '../../PopUpPage/SuccessPopUp';
import { getAddressByPincode } from '../../Services/AddressService';
import { registerUser } from '../../Services/UserService';

const UserRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Basic Information
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        profilePicture: null,
        // Personal Details
        dateOfBirth: '',
        gender: '',
        occupation: '',
        // Address
        address: {
            addressLine1: '',
            addressLine2: '',
            flatNumber: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            district: '',
            addressIndex: null,
            addressId: null
        },
        // Social Media
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        },
        // Password
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPincode, setIsPincode] = useState(false);
    const [addressPincode, setAddressPincode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        occupation: '',
        address: {
            addressLine1: '',
            city: '',
            state: '',
            pincode: '',
            addressIndex: ''
        },
        password: '',
        confirmPassword: ''
    });

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
        if (value.trim() !== '') {
            setErrors(prev => ({
                ...prev,
                [name]: ''
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

    const handlePincodeSubmit = async (e) => {
        e.preventDefault();
        if (formData.address.pincode.length === 6) {
            try {
                setIsLoading(true);
                const response = await getAddressByPincode({
                    pincode: formData.address.pincode
                });
                setAddressPincode(response.data.data.address);
                setIsPincode(true);
            } catch (error) {
                setErrorMessage('Failed to fetch address details');
                setShowError(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage('Please enter a valid pincode');
            setShowError(true);
            setIsPincode(false);
        }
    };

    const handlePostoffice = (e) => {
        const index = e.target.value;
        if (index !== null) {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    city: addressPincode[index].taluk,
                    state: addressPincode[index].stateName,
                    district: addressPincode[index].districtName,
                    addressId: addressPincode[index]._id
                }
            }));
        }
    };

    const validateStep = (step) => {
        const newErrors = { ...errors };
        let isValid = true;

        switch (step) {
            case 1:
                if (!formData.firstName.trim()) {
                    newErrors.firstName = 'First name is required';
                    isValid = false;
                }
                if (!formData.lastName.trim()) {
                    newErrors.lastName = 'Last name is required';
                    isValid = false;
                }
                if (!formData.email.trim()) {
                    newErrors.email = 'Email is required';
                    isValid = false;
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = 'Email is invalid';
                    isValid = false;
                }
                if (!formData.phoneNumber.trim()) {
                    newErrors.phoneNumber = 'Phone number is required';
                    isValid = false;
                } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
                    newErrors.phoneNumber = 'Phone number must be valid (10 digits, starts with 6-9)';
                    isValid = false;
                }
                break;
            case 2:
                if (!formData.dateOfBirth) {
                    newErrors.dateOfBirth = 'Date of birth is required';
                    isValid = false;
                }
                if (!formData.gender) {
                    newErrors.gender = 'Gender is required';
                    isValid = false;
                }
                if (!formData.occupation.trim()) {
                    newErrors.occupation = 'Occupation is required';
                    isValid = false;
                }
                break;
            case 3:
                if (!formData.address.pincode.trim()) {
                    newErrors.address.pincode = 'Pincode is required';
                    isValid = false;
                } else if (!/^\d{6}$/.test(formData.address.pincode)) {
                    newErrors.address.pincode = 'Pincode must be 6 digits';
                    isValid = false;
                }
                if (!formData.address.addressLine1.trim()) {
                    newErrors.address.addressLine1 = 'Address line is required';
                    isValid = false;
                }
                break;
            case 4:
                const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
                if (!formData.password.trim()) {
                    newErrors.password = 'Password is required';
                    isValid = false;
                } else if (!strongPasswordRegex.test(formData.password)) {
                    newErrors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
                    isValid = false;
                }
                if (!formData.confirmPassword.trim()) {
                    newErrors.confirmPassword = 'Please confirm your password';
                    isValid = false;
                } else if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                    isValid = false;
                }
                break;
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = (e) => {
        e.preventDefault();
        if (validateStep(step)) {
            if (step < 5) setStep(step + 1);
        } else {
            setErrorMessage('Please fill in all required fields correctly');
            setShowError(true);
        }
    };

    const prevStep = (e) => {
        e.preventDefault();
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep(step)) {
            if (formData.password !== formData.confirmPassword) {
                setErrorMessage('Passwords do not match!');
                setShowError(true);
                return;
            }
            const name = formData.firstName + ' ' + formData.lastName;
            try {
                const data = {
                    name: name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    occupation: formData.occupation,
                    addressId: formData.address.addressId,
                    addressType: formData.address.addressType,
                    landmark: formData.address.landmark,
                    addressLine1: formData.address.addressLine1,
                    addressLine2: formData.address.addressLine2,
                    flatNumber: formData.address.flatNumber,
                    city: formData.address.city,
                    state: formData.address.state,
                    district: formData.address.district,
                    country: formData.address.country,
                    socialLinks: formData.socialLinks,
                    password: formData.password,
                    avatar: formData.profilePicture
                }
                console.log("Data: ", data);
                
                setIsLoading(true);
                const response = await registerUser({
                    name: name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    occupation: formData.occupation,
                    addressId: formData.address.addressId,
                    addressType: formData.address.addressType,
                    landmark: formData.address.landmark,
                    addressLine1: formData.address.addressLine1,
                    addressLine2: formData.address.addressLine2,
                    flatNumber: formData.address.flatNumber,
                    city: formData.address.city,
                    state: formData.address.state,
                    district: formData.address.district,
                    country: formData.address.country,
                    socialLinks: formData.socialLinks,
                    password: formData.password,
                    avatar: formData.profilePicture
                });

                if (response.status === 200) {
                    setShowSuccessPopup(true);
                    setSuccessMessage(response.data.message);
                } else {
                    setErrorMessage(response.data.message);
                    setShowError(true);
                }
            } catch (error) {
                setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
                setShowError(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrorMessage('Please fill in all required fields correctly');
            setShowError(true);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Basic Information</h2>
                        
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-200">
                                {previewUrl ? (
                                    <img 
                                        src={previewUrl} 
                                        alt="Profile Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <FaUser className="text-4xl text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300">
                                    <FaCamera />
                                    <span>Upload Photo</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full border-2 ${errors.firstName ? 'border-red-500' : 'border-gray-200'} px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                                />
                                {errors.firstName && (
                                    <div className="flex items-center mt-1 text-red-500 text-sm">
                                        <FaExclamationCircle className="mr-1" />
                                        {errors.firstName}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full border-2 ${errors.lastName ? 'border-red-500' : 'border-gray-200'} px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                                />
                                {errors.lastName && (
                                    <div className="flex items-center mt-1 text-red-500 text-sm">
                                        <FaExclamationCircle className="mr-1" />
                                        {errors.lastName}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                            />
                            {errors.email && (
                                <div className="flex items-center mt-1 text-red-500 text-sm">
                                    <FaExclamationCircle className="mr-1" />
                                    {errors.email}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`w-full border-2 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                            />
                            {errors.phoneNumber && (
                                <div className="flex items-center mt-1 text-red-500 text-sm">
                                    <FaExclamationCircle className="mr-1" />
                                    {errors.phoneNumber}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Personal Details</h2>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className={`w-full border-2 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'} px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                        />
                        {errors.dateOfBirth && (
                            <div className="flex items-center mt-1 text-red-500 text-sm">
                                <FaExclamationCircle className="mr-1" />
                                {errors.dateOfBirth}
                            </div>
                        )}
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`w-full border-2 ${errors.gender ? 'border-red-500' : 'border-gray-200'} px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && (
                            <div className="flex items-center mt-1 text-red-500 text-sm">
                                <FaExclamationCircle className="mr-1" />
                                {errors.gender}
                            </div>
                        )}
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="occupation"
                                placeholder="Occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className={`w-full border-2 ${errors.occupation ? 'border-red-500' : 'border-gray-200'} px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                            />
                            {errors.occupation && (
                                <div className="flex items-center mt-1 text-red-500 text-sm">
                                    <FaExclamationCircle className="mr-1" />
                                    {errors.occupation}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Address Details</h2>
                        <div className="mb-4 relative">
                            <label className="flex justify-between items-center">
                                <span>Pincode</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address.pincode"
                                placeholder="Pincode"
                                value={formData.address.pincode}
                                onChange={handleChange}
                                className={`w-full border-2 ${errors.address?.pincode ? 'border-red-500' : 'border-gray-200'} px-4 py-2 pl-6 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                            />
                            {errors.address?.pincode && (
                                <div className="flex items-center mt-1 text-red-500 text-sm">
                                    <FaExclamationCircle className="mr-1" />
                                    {errors.address.pincode}
                                </div>
                            )}
                            <button
                                onClick={handlePincodeSubmit}
                                className="mt-3 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300"
                            >
                                Submit
                            </button>
                        </div>

                        {isPincode && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="flex justify-between items-center w-1/2">
                                        <span>Select Post Office</span>
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="address.addressIndex"
                                        value={formData.address.addressIndex}
                                        onChange={handlePostoffice}
                                        className={`w-1/2 border-2 ${errors.address?.addressIndex ? 'border-red-500' : 'border-gray-200'} px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                                    >
                                        <option value="">-- Select a Post Office --</option>
                                        {addressPincode?.map((item, index) => (
                                            <option key={item.officeName} value={index}>
                                                {item.officeName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <label className="flex justify-between items-center">
                                        <span>District</span>
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address.district"
                                        placeholder="District"
                                        readOnly
                                        value={formData.address.district}
                                        className="w-full border-2 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="flex justify-between items-center">
                                        <span>Address Line 1</span>
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address.addressLine1"
                                        placeholder="Address Line 1"
                                        value={formData.address.addressLine1}
                                        onChange={handleChange}
                                        className={`w-full border-2 ${errors.address.addressLine1 ? 'border-red-500' : 'border-gray-200'} px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                                    />
                                    {errors.address.addressLine1 && (
                                        <div className="flex items-center mt-1 text-red-500 text-sm">
                                            <FaExclamationCircle className="mr-1" />
                                            {errors.address.addressLine1}
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    name="address.addressLine2"
                                    placeholder="Address Line 2"
                                    value={formData.address.addressLine2}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                />

                                <input
                                    type="text"
                                    name="address.flatNumber"
                                    placeholder="Flat/House Number"
                                    value={formData.address.flatNumber}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                />

                                <input
                                    type="text"
                                    name="address.landmark"
                                    placeholder="Landmark"
                                    value={formData.address.landmark}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex justify-between items-center">
                                            <span>City</span>
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            placeholder="City"
                                            readOnly
                                            value={formData.address.city}
                                            className={`w-full border-2 ${errors.address.city ? 'border-red-500' : 'border-gray-200'} px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                                        />
                                    </div>

                                    <div>
                                        <label className="flex justify-between items-center">
                                            <span>State</span>
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            placeholder="State"
                                            readOnly
                                            value={formData.address.state}
                                            className={`w-full border-2 ${errors.address.state ? 'border-red-500' : 'border-gray-200'} px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Create Password</h2>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.password && (
                                <div className="flex items-center mt-1 text-red-500 text-sm">
                                    <FaExclamationCircle className="mr-1" />
                                    {errors.password}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                            />
                            {errors.confirmPassword && (
                                <div className="flex items-center mt-1 text-red-500 text-sm">
                                    <FaExclamationCircle className="mr-1" />
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </div>
                        <p className="text-black font-bold">
                            <span className="text-red-500">Note:</span> Use 8+ characters with uppercase, lowercase, number & symbol Example: Abc@1234
                        </p>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Verify Information</h2>
                        <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    {previewUrl && (
                                        <img 
                                            src={previewUrl} 
                                            alt="Profile" 
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <p><span className="font-semibold">Name:</span> {formData.firstName} {formData.lastName}</p>
                                        <p><span className="font-semibold">Email:</span> {formData.email}</p>
                                        <p><span className="font-semibold">Phone:</span> {formData.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Personal Details</h3>
                                <p><span className="font-semibold">Date of Birth:</span> {formData.dateOfBirth}</p>
                                <p><span className="font-semibold">Gender:</span> {formData.gender}</p>
                                <p><span className="font-semibold">Occupation:</span> {formData.occupation}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Address</h3>
                                <p><span className="font-semibold">Address:</span> {formData.address.addressLine1}, {formData.address.addressLine2}</p>
                                <p><span className="font-semibold">Flat Number:</span> {formData.address.flatNumber}</p>
                                <p><span className="font-semibold">Landmark:</span> {formData.address.landmark}</p>
                                <p><span className="font-semibold">Location:</span> {formData.address.city}, {formData.address.state} - {formData.address.pincode}</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden p-8 transform transition-all duration-500 hover:scale-[1.01]">
                {/* Progress Steps */}
                <div className="flex justify-between mb-8">
                    {[1, 2, 3, 4, 5].map((stepNumber) => (
                        <div key={stepNumber} className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    step >= stepNumber
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                {step > stepNumber ? <FaCheck /> : stepNumber}
                            </div>
                            <span className="text-sm mt-2 text-gray-600">
                                {stepNumber === 1 ? 'Basic' : 
                                 stepNumber === 2 ? 'Personal' : 
                                 stepNumber === 3 ? 'Address' : 
                                 stepNumber === 4 ? 'Password' : 'Verify'}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderStep()}
                    
                    <div className="flex justify-between mt-6">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
                            >
                                Back
                            </button>
                        )}
                        {step < 5 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
                            >
                                Next <FaArrowRight />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                            >
                                Register
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <LoadingPopUp isLoading={isLoading} />
            <ErrorPopUp
                isOpen={showError}
                onClose={() => setShowError(false)}
                message={errorMessage}
                title="Validation Error"
            />
            <SuccessPopUp
                isOpen={showSuccessPopup}
                onClose={() => {
                    setShowSuccessPopup(false);
                    navigate('/login');
                }}
                message={successMessage}
                title="Success"
            />
        </div>
    );
};

export default UserRegister;
