import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import {
  FaUser,
  FaArrowRight,
  FaCheck,
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
  FaEye,
  FaEyeSlash,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaCamera,
  FaImage,
  FaExclamationCircle,
} from "react-icons/fa";
import ErrorPopUp from "../../PopUpPage/ErrorPopUp";
import { getAddressByPincode } from "../../Services/AddressService";
import LoadingPopUp from "../../PopUpPage/LoadingPopUp";
import { registerCharity } from "../../Services/CharityService";
import SuccessPopUp from "../../PopUpPage/SuccessPopUp";

const CharityRegister = () => {
  // for success message popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Details
    name: "",
    description: "",
    mission: "",
    vision: "",
    logoImage: null,
    coverImage: null,
    // Founding & Legal
    founderName: "",
    establishedDate: "",
    registeredNGO: false,
    registrationNumber: "",
    panNumber: "",
    // Contact Information
    email: "",
    phoneNumbers: [""],
    website: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
    // Address
    address: {
      addressType: "office",
      landmark: "",
      addressLine1: "",
      addressLine2: "",
      flatNumber: "",
      city: "",
      state: "",
      pincode: "",
      district: "",
      addressIndex: null,
      addressId: null,
    },
    // Password
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isPincode, setIsPincode] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    founderName: "",
    registrationNumber: "",
    establishedDate: "",
    email: "",
    phoneNumbers: [""],
    address: {
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      addressIndex: "",
    },
    password: "",
    confirmPassword: "",
  });
  const [addressPincode, setAddressPincode] = useState(null);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    if (formData.address.pincode.length === 6) {
      try {
        setIsLoading(true);
        const response = await getAddressByPincode({
          pincode: formData.address.pincode,
        });

        console.log("Address: ", response);
        setAddressPincode(response.data.data.address);
        console.log("Address Pincode: ", addressPincode);

        setIsPincode(true);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowError(true);
      setErrorMessage("Please enter a valid pincode.");
      setIsPincode(false);
    }
  };

  const handlePostoffice = (e) => {
    console.log("Postoffice: ", e.target.value);
    const index = e.target.value;
    if (index !== null) {
      console.log("Address Pincode with index: ", addressPincode[index]);
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          city: addressPincode[index].taluk,
          state: addressPincode[index].stateName,
          district: addressPincode[index].districtName,
          addressId: addressPincode[index]._id,
        },
      }));
      // console.log("Address Pincode with index: ", addressPincode[formData.address.index]);
      console.log(formData.address.addressId);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    if (value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneChange = (index, value) => {
    const newPhoneNumbers = [...formData.phoneNumbers];
    newPhoneNumbers[index] = value;
      setFormData((prev) => ({
        ...prev,
      phoneNumbers: newPhoneNumbers,
    }));
  };

  const addPhoneNumber = () => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ""],
    }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      if (step < 8) setStep(step + 1);
    } else {
      setErrorMessage("Please fill in all required fields correctly");
      setShowError(true);
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const validateStep = (step) => {
    const newErrors = { ...errors };
    let isValid = true;

    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = "Organization name is required";
          isValid = false;
        } else if (
          formData.name.trim().length < 3 ||
          formData.name.trim().length > 100
        ) {
          newErrors.name =
            "Organization name must be between 3 and 100 characters";
          isValid = false;
        }

        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
          isValid = false;
        } else if (
          formData.description.trim().length < 10 ||
          formData.description.trim().length > 500
        ) {
          newErrors.description =
            "Description must be between 10 and 500 characters";
          isValid = false;
        }
        break;
      case 2:
        if (!formData.founderName.trim()) {
          newErrors.founderName = "Founder name is required";
          isValid = false;
        } else if (
          formData.founderName.trim().length < 3 ||
          formData.founderName.trim().length > 100
        ) {
          newErrors.founderName =
            "Founder name must be between 3 and 100 characters";
          isValid = false;
        }
        if (!formData.establishedDate) {
          newErrors.establishedDate = "Established year is required";
          isValid = false;
        } else if (!/^\d{4}$/.test(formData.establishedDate)) {
          newErrors.establishedDate = "Established year must be in YYYY format";
          isValid = false;
        } else if (
          parseInt(formData.establishedDate) > new Date().getFullYear()
        ) {
          newErrors.establishedDate =
            "Established year cannot be in the future";
          isValid = false;
        }

        if (formData.registeredNGO) {
          if (!formData.registrationNumber.trim()) {
            newErrors.registrationNumber = "Registration number is required";
          isValid = false;
          }
        }
        break;
      case 3:
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Email is invalid";
          isValid = false;
        }
        const phoneRegex = /^[6-9]\d{9}$/;

        if (
          formData.phoneNumbers.some(
            (phone) => !phone.trim() || !phoneRegex.test(phone.trim())
          )
        ) {
          newErrors.phoneNumbers = [
            "Each phone number must be valid (10 digits, starts with 6-9)",
          ];
          isValid = false;
        }

        break;
      case 4:
        if (!formData.address.pincode.trim()) {
          newErrors.address.pincode = "Pincode is required";
          isValid = false;
        } else if (!/^\d{6}$/.test(formData.address.pincode)) {
          newErrors.address.pincode = "Pincode must be 6 digits";
          isValid = false;
        }
        // if (!formData.address.addressLine1.trim()) {
        //   newErrors.address.addressLine1 = "Address line is required";
        //   isValid = false;
        // }
        break;
      case 6:
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

        if (!formData.password.trim()) {
          newErrors.password = "Password is required";
          isValid = false;
        } else if (!strongPasswordRegex.test(formData.password)) {
          newErrors.password =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
          isValid = false;
        }

        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
          isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match!");
        setShowError(true);
        return;
      }
      // Handle registration logic here
      console.log("Registration data:", formData);
      const registerData = {
        name: formData.name,
        description: formData.description,
        password: formData.password,
        mission: formData.mission,
        vision: formData.vision,
        addressId: formData.address.addressId,
        addressType: formData.address.addressType,
        landmark: formData.address.landmark,
        addressLine1: formData.address.addressLine1,
        addressLine2: formData.address.addressLine2,
        flatNumber: formData.address.flatNumber,
        founderName: formData.founderName,
        establishedDate: formData.establishedDate,
        registerNGO: formData.registeredNGO,
        registrationNumber: formData.registrationNumber,
        panNumber: formData.panNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumbers,
        website: formData.website,
        facebookLink: formData.socialLinks.facebook,
        twitterLink: formData.socialLinks.twitter,
        instagramLink: formData.socialLinks.instagram,
        linkedinLink: formData.socialLinks.linkedin,
        youtubeLink: formData.socialLinks.youtube,
        logoImage: formData.logoImage,
        coverImage: formData.coverImage,
      };

      console.log("registerData: ", registerData);

      try {
        setIsLoading(true);
        const response = await registerCharity({
          name: formData.name,
          description: formData.description,
          password: formData.password,
          mission: formData.mission,
          vision: formData.vision,
          addressId: formData.address.addressId,
          addressType: formData.address.addressType,
          landmark: formData.address.landmark,
          addressLine1: formData.address.addressLine1,
          addressLine2: formData.address.addressLine2,
          flatNumber: formData.address.flatNumber,
          founderName: formData.founderName,
          establishedDate: formData.establishedDate,
          registerNGO: formData.registeredNGO,
          registrationNumber: formData.registrationNumber,
          panNumber: formData.panNumber,
          email: formData.email,
          phoneNumber: formData.phoneNumbers,
          website: formData.website,
          facebookLink: formData.socialLinks.facebook,
          twitterLink: formData.socialLinks.twitter,
          instagramLink: formData.socialLinks.instagram,
          linkedinLink: formData.socialLinks.linkedin,
          youtubeLink: formData.socialLinks.youtube,
          logoImage: formData.logoImage,
          coverImage: formData.coverImage,
        });

        if (response.status === 200) {
          console.log("response: ", response);
          setShowSuccessPopup(true);
          setSuccessMessage(response.data.message);
          console.log("response: ", response);
        
        } else {
          setErrorMessage(response.data.message);
          setShowError(true);
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage(
          error.response.data.message || "Registration failed. Please try again."
        );
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Please fill in all required fields correctly");
      setShowError(true);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "logo") {
        setFormData((prev) => ({
          ...prev,
          logoImage: file,
        }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (type === "cover") {
        setFormData((prev) => ({
          ...prev,
          coverImage: file,
        }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Basic Information
            </h2>

            {/* Cover Image Upload */}

            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Organization Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border-2 ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.name && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.name}
                  </div>
                )}
              </div>
            <div className="relative">
              <textarea
                name="description"
                placeholder="Organization Description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full border-2  ${
                  errors.description ? "border-red-500" : "border-gray-200"
                } px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 h-32`}
              />
              <span className="absolute right-3 top-6 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.description && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.description}
                </div>
              )}
            </div>

            <textarea
              name="mission"
              placeholder="Mission Statement"
              value={formData.mission}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 h-32"
            />
            <textarea
              name="vision"
              placeholder="Vision Statement"
              value={formData.vision}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 h-32"
            />
            </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Founding & Legal Details
            </h2>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="founderName"
                placeholder="Founder Name"
                value={formData.founderName}
                onChange={handleChange}
                className={`w-full border-2 ${
                  errors.founderName ? "border-red-500" : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.founderName && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.founderName}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                name="establishedDate"
                placeholder="Established Year"
                value={formData.establishedDate}
                onChange={handleChange}
                className={`w-full border-2 ${
                  errors.establishedDate ? "border-red-500" : "border-gray-200"
                } px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.establishedDate && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.establishedDate}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="registeredNGO"
                checked={formData.registeredNGO}
                onChange={handleChange}
                className="rounded text-green-500"
              />
              <label className="text-gray-700">Registered NGO </label>
            </div>
            {formData.registeredNGO && (
              <div className="relative">
                <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="registrationNumber"
                placeholder="Registration Number"
                value={formData.registrationNumber}
                onChange={handleChange}
                className={`w-full border-2 ${
                    errors.registrationNumber
                      ? "border-red-500"
                      : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.registrationNumber && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.registrationNumber}
                </div>
              )}
            </div>
            )}
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="panNumber"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={handleChange}
                className={`w-full border-2 ${
                  errors.panNumber ? "border-red-500" : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Contact Information
            </h2>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Organization Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border-2 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.email && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                    placeholder={`Phone Number ${index + 1}`}
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                className={`w-full border-2 ${
                      errors.phoneNumbers && errors.phoneNumbers[index]
                        ? "border-red-500"
                        : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
                  {errors.phoneNumbers && errors.phoneNumbers[index] && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                      {errors.phoneNumbers[index]}
                </div>
              )}
            </div>
              ))}

              <button
                type="button"
                onClick={addPhoneNumber}
                className="text-green-500 hover:text-green-600 text-sm flex items-center gap-1"
              >
                <FaPhone className="text-xs" /> Add Another Phone Number
              </button>
            </div>

            <div className="relative">
              <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                name="website"
                placeholder="Website URL"
                value={formData.website}
                onChange={handleChange}
                className={`w-full border-2 ${
                  errors.website ? "border-red-500" : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.website && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.website}
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Address Details
            </h2>

            {/* Address Type */}
            <div className="relative">
              <label className="flex justify-between items-center w-1/2">
                <span>Address Type</span>
                <span className="text-red-500">*</span>
              </label>
            <select
                name="address.addressType"
                value={formData.address.addressType}
              onChange={handleChange}
                className={`w-1/2 border-2 ${
                  errors.address.addressType
                    ? "border-red-500"
                    : "border-gray-200"
              } px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
            >
                <option value="office">Office</option>
                <option value="branch">Branch</option>
              <option value="other">Other</option>
            </select>
              {errors.address.addressType && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.address.addressType}
                </div>
              )}
            </div>

            {/* Pincode */}
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
              className={`w-full border-2 ${
                  errors.address?.pincode ? "border-red-500" : "border-gray-200"
                } px-4 py-2 pl-6 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
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

            {/* Additional Address Fields */}
            {isPincode && (
          <div className="space-y-4">
                {/* Post Office Select */}
            <div className="relative">
                  <label className="flex justify-between items-center w-1/2">
                    <span>Select Post Office</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="address.addressIndex"
                    value={formData.address.addressIndex}
                    onChange={handlePostoffice}
                    className={`w-1/2 border-2 ${
                      errors.address?.addressIndex
                        ? "border-red-500"
                        : "border-gray-200"
                    } px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                  >
                    <option value="">-- Select a Post Office --</option>
                    {addressPincode.map((item, index) => (
                      <option key={item.officeName} value={index}>
                        {item.officeName}
                      </option>
                    ))}
                  </select>

                  {errors.address?.addressIndex && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <FaExclamationCircle className="mr-1" />
                      {errors.address.addressIndex}
                    </div>
                  )}
                </div>

                {/* District  */}
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
                    onChange={handleChange}
                    className={`w-full border-2 
                    px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                  />
                </div>
                {/* Address Line 1 */}
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
                className={`w-full border-2 ${
                      errors.address.addressLine1
                        ? "border-red-500"
                        : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              {errors.address.addressLine1 && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.address.addressLine1}
                </div>
              )}
            </div>

                {/* Address Line 2 */}
            <input
              type="text"
              name="address.addressLine2"
              placeholder="Address Line 2"
              value={formData.address.addressLine2}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
            />

                {/* Flat Number */}
                <input
                  type="text"
                  name="address.flatNumber"
                  placeholder="Flat/House Number"
                  value={formData.address.flatNumber}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                />

                {/* Landmark */}
                <input
                  type="text"
                  name="address.landmark"
                  placeholder="Landmark"
                  value={formData.address.landmark}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                />

                {/* City and State */}
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
                onChange={handleChange}
                className={`w-full border-2 ${
                        errors.address.city
                          ? "border-red-500"
                          : "border-gray-200"
                } px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
                    {errors.address.city && (
                      <div className="flex items-center mt-1 text-red-500 text-sm">
                        <FaExclamationCircle className="mr-1" />
                        {errors.address.city}
                      </div>
                    )}
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
                onChange={handleChange}
                className={`w-full border-2 ${
                        errors.address.state
                          ? "border-red-500"
                          : "border-gray-200"
                } px-4 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
                    {errors.address.state && (
                      <div className="flex items-center mt-1 text-red-500 text-sm">
                        <FaExclamationCircle className="mr-1" />
                        {errors.address.state}
            </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Social Media Links
            </h2>
            <div className="space-y-4">
            <div className="relative">
                <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                  type="url"
                  name="socialLinks.facebook"
                  placeholder="Facebook URL"
                  value={formData.socialLinks.facebook}
                onChange={handleChange}
                  className={`w-full border-2  px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
                </div>
              <div className="relative">
                <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="socialLinks.twitter"
                  placeholder="Twitter URL"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className={`w-full border-2  px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                />
            </div>
              <div className="relative">
                <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                  type="url"
                  name="socialLinks.instagram"
                  placeholder="Instagram URL"
                  value={formData.socialLinks.instagram}
              onChange={handleChange}
                  className={`w-full border-2 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
            />
              </div>
            <div className="relative">
                <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                  type="url"
                  name="socialLinks.linkedin"
                  placeholder="LinkedIn URL"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className={`w-full border-2 px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                />
              </div>
              <div className="relative">
                <FaYoutube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="socialLinks.youtube"
                  placeholder="YouTube URL"
                  value={formData.socialLinks.youtube}
                  onChange={handleChange}
                  className={`w-full border-2  px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Create Password
            </h2>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border-2 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.password && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.password}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full border-2 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                } px-10 py-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                *
              </span>
              {errors.confirmPassword && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <FaExclamationCircle className="mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <p className=" text-black bold">
              <span className=" text-red-500">Note:</span>Use 8+ characters with
              uppercase, lowercase, number & symbol Example: Abc@1234
            </p>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Verify Information
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  {coverPreview && (
                    <div className="w-full h-48 rounded-xl overflow-hidden">
                      <img
                        src={coverPreview}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p>
                        <span className="font-semibold">
                          Organization Name:
                        </span>{" "}
                        {formData.name}
                      </p>
                      <p>
                        <span className="font-semibold">Description:</span>{" "}
                        {formData.description}
                      </p>
                      <p>
                        <span className="font-semibold">Mission:</span>{" "}
                        {formData.mission}
                      </p>
                      <p>
                        <span className="font-semibold">Vision:</span>{" "}
                        {formData.vision}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Legal Information
                </h3>
                <p>
                  <span className="font-semibold">Founder Name:</span>{" "}
                  {formData.founderName}
                </p>
                <p>
                  <span className="font-semibold">Established Year:</span>{" "}
                  {formData.establishedDate}
                </p>
                <p>
                  <span className="font-semibold">Registered NGO:</span>{" "}
                  {formData.registeredNGO ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold">Registration Number:</span>{" "}
                  {formData.registrationNumber}
                </p>
                <p>
                  <span className="font-semibold">PAN Number:</span>{" "}
                  {formData.panNumber}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Contact Information
                </h3>
                <p>
                  <span className="font-semibold">Email:</span> {formData.email}
                </p>
                <p>
                  <span className="font-semibold">Phone Numbers:</span>
                </p>
                <ul className="list-disc pl-4">
                  {formData.phoneNumbers.map((phone, index) => (
                    <li key={index}>{phone}</li>
                  ))}
                </ul>
                <p>
                  <span className="font-semibold">Website:</span>{" "}
                  {formData.website}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Address</h3>
                <p>
                  <span className="font-semibold">Address Type:</span>{" "}
                  {formData.address.addressType}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {formData.address.addressLine1},{" "}
                  {formData.address.addressLine2}
                </p>
                <p>
                  <span className="font-semibold">Flat Number:</span>{" "}
                  {formData.address.flatNumber}
                </p>
                <p>
                  <span className="font-semibold">Landmark:</span>{" "}
                  {formData.address.landmark}
                </p>
                {/* <p>
                  <span className="font-semibold">AddressID:</span>{" "}
                  {formData.address.addressId} ignore this 
                </p> */}
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {formData.address.city}, {formData.address.state} -{" "}
                  {formData.address.pincode}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Social Media</h3>
                <p>
                  <span className="font-semibold">Facebook:</span>{" "}
                  {formData.socialLinks.facebook}
                </p>
                <p>
                  <span className="font-semibold">Twitter:</span>{" "}
                  {formData.socialLinks.twitter}
                </p>
                <p>
                  <span className="font-semibold">Instagram:</span>{" "}
                  {formData.socialLinks.instagram}
                </p>
                <p>
                  <span className="font-semibold">LinkedIn:</span>{" "}
                  {formData.socialLinks.linkedin}
                </p>
                <p>
                  <span className="font-semibold">YouTube:</span>{" "}
                  {formData.socialLinks.youtube}
                </p>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Basic Information
            </h2>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <FaImage className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300">
                  <FaCamera />
                  <span>Upload Cover Image</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cover")}
                  className="hidden"
                />
              </label>
            </div>

            {/* Logo Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-200">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <FaBuilding className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300">
                  <FaCamera />
                  <span>Upload Logo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                  className="hidden"
                />
              </label>
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
          {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > stepNumber ? <FaCheck /> : stepNumber}
              </div>
              <span className="text-sm mt-2 text-gray-600">
                {stepNumber === 1
                  ? "Basic"
                  : stepNumber === 2
                  ? "Legal"
                  : stepNumber === 3
                  ? "Contact"
                  : stepNumber === 4
                  ? "Address"
                  : stepNumber === 5
                  ? "Social"
                  : stepNumber === 6
                  ? "Password"
                  : stepNumber === 7
                  ? "Verify"
                  : "Logo"}
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
            {step < 8 ? (
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
        onClose={()=>{
          setShowSuccessPopup(false);
          navigate("/login");
        }}
        message={successMessage}
        title="Success"
      />
    </div>
  );
};

export default CharityRegister;
