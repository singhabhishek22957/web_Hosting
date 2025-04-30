import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaUtensils, FaCalendarAlt, FaClock, FaPhone, FaCheck } from 'react-icons/fa';
import { getDonationById, acceptDonationByCharity } from '../../Services/DonationService';
import LoadingPopUp from '../../PopUpPage/LoadingPopUp';
import ErrorPopUp from '../../PopUpPage/ErrorPopUp';
import SuccessPopUp from '../../PopUpPage/SuccessPopUp';
import { useCharity } from '../../Context/CharityContext';

const DonationView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {charity} = useCharity();
    const [donation, setDonation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchDonationDetails();
    }, [id]);

    const fetchDonationDetails = async () => {
        try {
            setIsLoading(true);
            const response = await getDonationById({ donationId: id });
            console.log("donation response",response);
            
            if (response?.status === 200) {
                setDonation(response.data.data.donation);
            } else {
                setError('Failed to fetch donation details');
            }
        } catch (err) {
            console.error('Error fetching donation:', err);
            setError(err.response?.data?.message || 'Failed to fetch donation details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptDonation = async () => {
        try {
            setIsLoading(true);
            const response = await acceptDonationByCharity({
                donationId: id,
                charityId: charity._id
            });
            
            if (response?.status === 200) {
                setSuccess('Donation accepted successfully!');
                // Refresh donation details
                fetchDonationDetails();

            }
            navigate('/');
            window.location.reload();
        } catch (err) {
            console.error('Error accepting donation:', err);
            setError(err.response?.data?.message || 'Failed to accept donation');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    if (isLoading) {
        return <LoadingPopUp isLoading={true} />;
    }

    if (error) {
        return (
            <ErrorPopUp
                isOpen={true}
                onClose={() => setError(null)}
                message={error}
            />
        );
    }

    if (!donation) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-500">Donation not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-blue-50 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Donation Details</h1>
                </div>

                {/* Donor Information */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaUser className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{donation.donnerName}</h2>
                            <p className="text-gray-600">{donation.eventType}</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                        <FaPhone className="text-green-500" />
                        <span className="text-gray-600">{donation.contactNumber}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                        <FaMapMarkerAlt className="text-red-500 mt-1" />
                        <div>
                            <p className="text-gray-600">
                                {donation.pickUpAddress.addressLine1}
                                {donation.pickUpAddress.addressLine2 && `, ${donation.pickUpAddress.addressLine2}`}
                            </p>
                            <p className="text-gray-600">
                                {donation.pickUpAddress.city}, {donation.pickUpAddress.state} - {donation.pickUpAddress.pincode}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Food Items */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Food Items</h3>
                    <div className="space-y-4">
                        {donation.foodDetails.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-800">{item.name}</span>
                                    <span className="text-gray-600">{item.quantity}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Ingredients: {item.ingredients}</p>
                                    <p>Best Before: {formatDate(item.bestBefore)}</p>
                                    <p>Food Type: {item.foodType}</p>
                                    <p>Best For: {item.bestFor}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pickup Details */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pickup Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <FaCalendarAlt className="text-purple-500" />
                            <span className="text-gray-600">{formatDate(donation.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaClock className="text-orange-500" />
                            <span className="text-gray-600">
                                {formatTime(donation.pickupTime.start)} - {formatTime(donation.pickupTime.end)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {localStorage.getItem('role') === 'charity' && !donation.acceptedByCharity && (
                    <div className="p-6 bg-gray-50">
                        <button
                            onClick={handleAcceptDonation}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                        >
                            <FaCheck />
                            <span>Accept Donation</span>
                        </button>
                    </div>
                )}

                {donation.acceptedByCharity && (
                    <div className="p-6 bg-green-50">
                        <p className="text-center text-green-600 font-medium">
                            This donation has been accepted by a charity
                        </p>
                    </div>
                )}
            </div>

            {/* Success Popup */}
            {success && (
                <SuccessPopUp
                    isOpen={true}
                    onClose={() => setSuccess(null)}
                    message={success}
                />
            )}
        </div>
    );
};

export default DonationView;
