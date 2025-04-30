import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { registerDonation } from '../../Services/DonationService';
import { getAddressByPincode } from '../../Services/AddressService';
import LoadingPopUp from '../../PopUpPage/LoadingPopUp';
import ErrorPopUp from '../../PopUpPage/ErrorPopUp';
import SuccessPopUp from '../../PopUpPage/SuccessPopUp';
import { useUser } from '../../Context/UserContext';

const DonationForm = ({ charityId, onSubmit }) => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        donnerName: user?.name || '',
        eventType: '',
        contact: user?.phoneNumber || '',
        date: '',
        pickupTime: {
            start: '',
            end: ''
        },
        foodDetails: [{
            name: '',
            quantity: '',
            ingredients: '',
            bestBeforeDate: '',
            foodType: 'veg',
            bestFor: []
        }],
        selfDelivery: false,
        pickUpAddress: {
            addressId: '',
            addressType: 'office',
            landmark: '',
            addressLine1: '',
            addressLine2: '',
            flatNumber: '',
            city: '',
            state: '',
            district: '',
            pincode: ''
        },
        packed: false,
        packedType: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isPincode, setIsPincode] = useState(false);
    const [addressPincode, setAddressPincode] = useState(null);

    const [errors, setErrors] = useState({
        donnerName: '',
        eventType: '',
        contact: '',
        date: '',
        pickupTime: {
            start: '',
            end: ''
        },
        foodDetails: [],
        pickUpAddress: {
            pincode: '',
            addressLine1: '',
            landmark: ''
        }
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
            // Validate nested field
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: error
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
            // Validate field
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handlePincodeSubmit = async (e) => {
        e.preventDefault();
        if (formData.pickUpAddress.pincode.length === 6) {
            try {
                setIsLoading(true);
                const response = await getAddressByPincode({
                    pincode: formData.pickUpAddress.pincode
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
                pickUpAddress: {
                    ...prev.pickUpAddress,
                    city: addressPincode[index].taluk,
                    state: addressPincode[index].stateName,
                    district: addressPincode[index].districtName,
                    addressId: addressPincode[index]._id
                }
            }));
        }
    };

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'donnerName':
                if (!value.trim()) error = 'Donor name is required';
                break;
            case 'eventType':
                if (!value.trim()) error = 'Event type is required';
                break;
            case 'contact':
                if (!value.trim()) error = 'Contact number is required';
                else if (!/^[6-9]\d{9}$/.test(value)) error = 'Invalid phone number';
                break;
            case 'date':
                if (!value) error = 'Date is required';
                break;
            case 'pickupTime.start':
                if (!value) error = 'Start time is required';
                break;
            case 'pickupTime.end':
                if (!value) error = 'End time is required';
                break;
            case 'pickUpAddress.pincode':
                if (!value) error = 'Pincode is required';
                else if (!/^\d{6}$/.test(value)) error = 'Invalid pincode';
                break;
            case 'pickUpAddress.addressLine1':
                if (!value.trim()) error = 'Address line 1 is required';
                break;
            case 'pickUpAddress.landmark':
                if (!value.trim()) error = 'Landmark is required';
                break;
        }
        return error;
    };

    const validateFoodItem = (item, index) => {
        const newErrors = [];
        if (!item.name.trim()) newErrors.push('Food name is required');
        if (!item.quantity.trim()) newErrors.push('Quantity is required');
        if (!item.ingredients.trim()) newErrors.push('Ingredients are required');
        if (!item.bestBeforeDate) newErrors.push('Best before date is required');
        if (!item.bestFor.length) newErrors.push('Best for is required');
        return newErrors;
    };

    const handleFoodItemChange = (index, field, value) => {
        const newFoodDetails = [...formData.foodDetails];
        newFoodDetails[index] = {
            ...newFoodDetails[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            foodDetails: newFoodDetails
        }));

        // Validate food item
        const foodErrors = validateFoodItem(newFoodDetails[index], index);
        setErrors(prev => ({
            ...prev,
            foodDetails: {
                ...prev.foodDetails,
                [index]: foodErrors
            }
        }));
    };

    const handleBestForChange = (index, value) => {
        const newFoodDetails = [...formData.foodDetails];
        newFoodDetails[index] = {
            ...newFoodDetails[index],
            bestFor: value.split(',').map(item => item.trim())
        };
        setFormData(prev => ({
            ...prev,
            foodDetails: newFoodDetails
        }));
    };

    const addFoodItem = () => {
        setFormData(prev => ({
            ...prev,
            foodDetails: [...prev.foodDetails, {
                name: '',
                quantity: '',
                ingredients: '',
                bestBeforeDate: '',
                foodType: 'veg',
                bestFor: []
            }]
        }));
    };

    const removeFoodItem = (index) => {
        setFormData(prev => ({
            ...prev,
            foodDetails: prev.foodDetails.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        if (!formData.donnerName || !formData.eventType || !formData.contact || !formData.date) {
            setErrorMessage('Please fill in all required fields');
            setShowError(true);
            return false;
        }

        if (!formData.pickupTime.start || !formData.pickupTime.end) {
            setErrorMessage('Please specify pickup time');
            setShowError(true);
            return false;
        }

        if (formData.foodDetails.length === 0) {
            setErrorMessage('Please add at least one food item');
            setShowError(true);
            return false;
        }

        for (const item of formData.foodDetails) {
            if (!item.name || !item.quantity || !item.ingredients || !item.bestBeforeDate) {
                setErrorMessage('Please fill in all food item details');
                setShowError(true);
                return false;
            }
        }

        if (!formData.selfDelivery && (!formData.pickUpAddress.addressLine1 || !formData.pickUpAddress.landmark)) {
            setErrorMessage('Please provide pickup address details');
            setShowError(true);
            return false;
        }

        if (formData.packed && !formData.packedType) {
            setErrorMessage('Please select packing type');
            setShowError(true);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            const donationData = {
                ...formData,
                generatedBy: {
                    user: user._id.toString()
                }
            };

            const response = await registerDonation(donationData);
            
            if (response.status === 201) {
                setSuccessMessage('Donation registered successfully!');
                setShowSuccess(true);
                if (onSubmit) {
                    onSubmit(response.data);
                }
                // Reset form after successful submission
                setFormData({
                    donnerName: user?.name || '',
                    eventType: '',
                    contact: user?.phoneNumber || '',
                    date: '',
                    pickupTime: {
                        start: '',
                        end: ''
                    },
                    foodDetails: [{
                        name: '',
                        quantity: '',
                        ingredients: '',
                        bestBeforeDate: '',
                        foodType: 'veg',
                        bestFor: []
                    }],
                    selfDelivery: false,
                    pickUpAddress: {
                        addressId: '',
                        addressType: 'office',
                        landmark: '',
                        addressLine1: '',
                        addressLine2: '',
                        flatNumber: '',
                        city: '',
                        state: '',
                        district: '',
                        pincode: ''
                    },
                    packed: false,
                    packedType: ''
                });
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to register donation. Please try again.');
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Donation Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Donor Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="donnerName"
                            value={formData.donnerName}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                errors.donnerName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.donnerName && (
                            <p className="mt-1 text-sm text-red-500">{errors.donnerName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                errors.eventType ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.eventType && (
                            <p className="mt-1 text-sm text-red-500">{errors.eventType}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                errors.contact ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.contact && (
                            <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                errors.date ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.date && (
                            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                        )}
                    </div>
                </div>

                {/* Pickup Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pickup Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="pickupTime.start"
                            value={formData.pickupTime.start}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                errors.pickupTime?.start ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.pickupTime?.start && (
                            <p className="mt-1 text-sm text-red-500">{errors.pickupTime.start}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pickup End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="pickupTime.end"
                            value={formData.pickupTime.end}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                errors.pickupTime?.end ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.pickupTime?.end && (
                            <p className="mt-1 text-sm text-red-500">{errors.pickupTime.end}</p>
                        )}
                    </div>
                </div>

                {/* Food Items */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Food Items <span className="text-red-500">*</span></h3>
                        <button
                            type="button"
                            onClick={addFoodItem}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            <FaPlus className="mr-2" /> Add Food Item
                        </button>
                    </div>
                    {formData.foodDetails.map((item, index) => (
                        <div key={index} className="p-4 border rounded-md space-y-4">
                            <div className="flex justify-between">
                                <h4 className="font-medium">Food Item {index + 1}</h4>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFoodItem(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Food Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                            errors.foodDetails?.[index]?.includes('Food name is required') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={item.quantity}
                                        placeholder="like - 5kg, 6pkt"
                                        onChange={(e) => handleFoodItemChange(index, 'quantity', e.target.value)}
                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                            errors.foodDetails?.[index]?.includes('Quantity is required') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ingredients <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={item.ingredients}
                                        onChange={(e) => handleFoodItemChange(index, 'ingredients', e.target.value)}
                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                            errors.foodDetails?.[index]?.includes('Ingredients are required') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Best Before Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={item.bestBeforeDate}
                                        onChange={(e) => handleFoodItemChange(index, 'bestBeforeDate', e.target.value)}
                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                            errors.foodDetails?.[index]?.includes('Best before date is required') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Food Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={item.foodType}
                                        onChange={(e) => handleFoodItemChange(index, 'foodType', e.target.value)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="veg">Vegetarian</option>
                                        <option value="non-veg">Non-Vegetarian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        For <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={item.bestFor.join(', ')}
                                        onChange={(e) => handleBestForChange(index, e.target.value)}
                                        placeholder="e.g., child, adult, baby, age(5-15)"
                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                            errors.foodDetails?.[index]?.includes('Best for is required') ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                </div>
                            </div>
                            {errors.foodDetails?.[index]?.length > 0 && (
                                <div className="mt-2">
                                    {errors.foodDetails[index].map((error, i) => (
                                        <p key={i} className="text-sm text-red-500">{error}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Delivery Options */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="selfDelivery"
                            checked={formData.selfDelivery}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                            I will deliver the food myself
                        </label>
                    </div>

                    {!formData.selfDelivery && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Pickup Address</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pincode
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="pickUpAddress.pincode"
                                        value={formData.pickUpAddress.pincode}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePincodeSubmit}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>

                            {isPincode && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Post Office
                                        </label>
                                        <select
                                            onChange={handlePostoffice}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Post Office</option>
                                            {addressPincode?.map((item, index) => (
                                                <option key={item.officeName} value={index}>
                                                    {item.officeName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 1
                                            </label>
                                            <input
                                                type="text"
                                                name="pickUpAddress.addressLine1"
                                                value={formData.pickUpAddress.addressLine1}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                name="pickUpAddress.addressLine2"
                                                value={formData.pickUpAddress.addressLine2}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Flat/House Number
                                            </label>
                                            <input
                                                type="text"
                                                name="pickUpAddress.flatNumber"
                                                value={formData.pickUpAddress.flatNumber}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Landmark
                                            </label>
                                            <input
                                                type="text"
                                                name="pickUpAddress.landmark"
                                                value={formData.pickUpAddress.landmark}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Packing Information */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="packed"
                            checked={formData.packed}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                            Food is packed
                        </label>
                    </div>

                    {formData.packed && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Packing Type
                            </label>
                            <select
                                name="packedType"
                                value={formData.packedType}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select packing type</option>
                                <option value="For Single Person Pkt">For Single Person</option>
                                <option value="For Multiple Person Pkt">For Multiple Persons</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit Donation
                    </button>
                </div>
            </form>

            {/* Popups */}
            <LoadingPopUp isLoading={isLoading} />
            
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
        </div>
    );
};

export default DonationForm;
