import React from 'react';
import { FaUser, FaMapMarkerAlt, FaUtensils, FaCalendarAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DonationCard = ({ donation }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    const handleViewMore = () => {
        navigate(`/donation/${donation._id}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Header with Donor Info */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaUser className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{donation.donnerName}</h3>
                        <p className="text-sm text-gray-500">{donation.eventType}</p>
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-red-500 mt-1" />
                    <div>
                        <p className="text-sm text-gray-600">
                            {donation.pickUpAddress.addressLine1}
                            {donation.pickUpAddress.addressLine2 && `, ${donation.pickUpAddress.addressLine2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                            {donation.pickUpAddress.city}, {donation.pickUpAddress.state} - {donation.pickUpAddress.pincode}
                        </p>
                    </div>
                </div>
            </div>

            {/* Food Items Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-3">
                    <FaUtensils className="text-green-500 mt-1" />
                    <div className="space-y-2">
                        {donation.foodDetails.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{item.name}</span>
                                <span className="text-sm font-medium text-gray-800">{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Date and Time Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-purple-500" />
                        <span className="text-sm text-gray-600">{formatDate(donation.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaClock className="text-orange-500" />
                        <span className="text-sm text-gray-600">
                            {formatTime(donation.pickupTime.start)} - {formatTime(donation.pickupTime.end)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer with View More Button */}
            <div className="p-6 bg-gray-50">
                <button
                    onClick={handleViewMore}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                    <span>View Details</span>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default DonationCard; 