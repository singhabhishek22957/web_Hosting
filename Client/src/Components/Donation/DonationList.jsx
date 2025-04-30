import React, { useState, useEffect } from 'react';
import DonationCard from './DonationCard';
import { getAllDonations } from '../../Services/DonationService';
import LoadingPopUp from '../../PopUpPage/LoadingPopUp';
import ErrorPopUp from '../../PopUpPage/ErrorPopUp';

const DonationList = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            setIsLoading(true);
            const response = await getAllDonations();
            console.log('response', response);
            
            if (response?.status === 200 && Array.isArray(response?.data?.data?.donations)) {
                setDonations(response.data.data.donations);
            } else {
                setDonations([]);
                setError('Invalid response format from server');
            }
        } catch (err) {
            console.error('Error fetching donations:', err);
            setDonations([]);
            setError(err.response?.data?.message || 'Failed to fetch donations');
        } finally {
            setIsLoading(false);
        }
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Donations</h2>
            
            {!Array.isArray(donations) || donations.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No donations available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donations.map((donation) => (
                        <DonationCard key={donation._id} donation={donation} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonationList;
