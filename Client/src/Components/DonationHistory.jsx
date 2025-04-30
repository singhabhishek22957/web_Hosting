import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaUtensils, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { getDonationHistory } from '../Services/UserService';
import { getCharityDonationHistory } from '../Services/CharityService';
import { useUser } from '../Context/UserContext';
import { useCharity } from '../Context/CharityContext';
import LoadingPopUp from '../PopUpPage/LoadingPopUp';
import ErrorPopUp from '../PopUpPage/ErrorPopUp';

const DonationHistory = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { charity } = useCharity();
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalDonations, setTotalDonations] = useState(0);

    useEffect(() => {
        fetchDonationHistory();
    }, []);

    const fetchDonationHistory = async () => {
        try {
            setIsLoading(true);
            let response;
            
            if (localStorage.getItem('role') === 'user') {
                response = await getDonationHistory({ userId: user._id });
            } else if (localStorage.getItem('role') === 'charity') {
                response = await getCharityDonationHistory({ charityId: charity._id });
            }

            if (response?.status === 200) {
                console.log("donation history response",response) 
                setDonations(response.data.data.donations || []);
                setTotalDonations(response.data.data.totalDonations || 0);
            } else {
                setError('Failed to fetch donation history');
            }
        } catch (err) {
            console.error('Error fetching donation history:', err);
            setError(err.response?.data?.message || 'Failed to fetch donation history');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleViewDetails = (donationId) => {
        navigate(`/donation/${donationId}`);
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

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaHistory className="text-blue-600 text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {localStorage.getItem('role') === 'user' ? 'Your Donation History' : 'Accepted Donations History'}
                            </h1>
                            <p className="text-gray-600">
                                Total {localStorage.getItem('role') === 'user' ? 'Donations' : 'Accepted Donations'}: {totalDonations}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donations List */}
            {donations.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500 text-lg">No donation history available</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {donations.map((donation) => (
                        <div key={donation._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                {/* Donation Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {localStorage.getItem('role') === 'user' ? 'Donated to' : 'Donated by'}: {localStorage.getItem('role') === 'user' ? donation.charityName : donation.donnerName}
                                        </h3>
                                        <p className="text-gray-600">{donation.eventType}</p>
                                    </div>
                                    {/* <span className={`px-3 py-1 rounded-full text-sm ${
                                        donation.acceptedByCharity ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {donation.acceptedByCharity ? 'Accepted' : 'Pending'}
                                    </span> */}
                                </div>

                                {/* Food Items Summary */}
                                <div className="mb-4">
                                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                        <FaUtensils />
                                        <span className="font-medium">Food Items:</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {donation.foodDetails.map((item, index) => (
                                            <div key={index} className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm">{item.name} ({item.quantity})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Date and Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <FaCalendarAlt />
                                        <span>{formatDate(donation.date)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <FaMapMarkerAlt />
                                        <span>{donation.pickUpAddress.city}, {donation.pickUpAddress.state}</span>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <button
                                    onClick={() => handleViewDetails(donation._id)}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                                >
                                    <span>View Details</span>
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonationHistory;
