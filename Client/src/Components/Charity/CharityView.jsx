import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import LoadingPopUp from '../PopUpPage/LoadingPopUp';
import ErrorPopUp from '../../PopUpPage/ErrorPopUp';

const CharityView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [charity, setCharity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        const fetchCharityDetails = async () => {
            try {
                setIsLoading(true);
                // Replace with your actual API endpoint
                const response = await fetch(`/api/charities/${id}`);
                const data = await response.json();
                setCharity(data);
            } catch (err) {
                setError('Failed to fetch charity details');
                console.error('Error fetching charity details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharityDetails();
    }, [id]);

    if (isLoading) {
        return <LoadingPopUp isLoading={isLoading} />;
    }

    if (error) {
        return <ErrorPopUp isOpen={true} onClose={() => navigate('/charities')} message={error} />;
    }

    if (!charity) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{charity.name}</h1>
                        <p className="text-xl md:text-2xl">{charity.tagline}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Charity Logo */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="aspect-square rounded-lg overflow-hidden mb-4">
                                {charity.logoUrl ? (
                                    <img
                                        src={charity.logoUrl}
                                        alt={charity.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-6xl text-gray-400">🏥</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                                    Donate Now
                                </button>
                                <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                {charity.address && (
                                    <div className="flex items-start">
                                        <FaMapMarkerAlt className="text-red-500 mt-1 mr-3" />
                                        <span>{charity.address}</span>
                                    </div>
                                )}
                                {charity.phone && (
                                    <div className="flex items-center">
                                        <FaPhone className="text-green-500 mr-3" />
                                        <span>{charity.phone}</span>
                                    </div>
                                )}
                                {charity.email && (
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-blue-500 mr-3" />
                                        <span>{charity.email}</span>
                                    </div>
                                )}
                                {charity.website && (
                                    <div className="flex items-center">
                                        <FaGlobe className="text-purple-500 mr-3" />
                                        <a href={charity.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            Visit Website
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Social Media Links */}
                            {charity.socialMedia && (
                                <div className="mt-6">
                                    <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
                                    <div className="flex space-x-4">
                                        {charity.socialMedia.facebook && (
                                            <a href={charity.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                <FaFacebook size={24} />
                                            </a>
                                        )}
                                        {charity.socialMedia.twitter && (
                                            <a href={charity.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                                                <FaTwitter size={24} />
                                            </a>
                                        )}
                                        {charity.socialMedia.instagram && (
                                            <a href={charity.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                                                <FaInstagram size={24} />
                                            </a>
                                        )}
                                        {charity.socialMedia.linkedin && (
                                            <a href={charity.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                                                <FaLinkedin size={24} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="flex border-b">
                                <button
                                    className={`px-6 py-3 ${activeTab === 'about' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('about')}
                                >
                                    About
                                </button>
                                <button
                                    className={`px-6 py-3 ${activeTab === 'programs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('programs')}
                                >
                                    Programs
                                </button>
                                <button
                                    className={`px-6 py-3 ${activeTab === 'impact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('impact')}
                                >
                                    Impact
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {activeTab === 'about' && (
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">About {charity.name}</h2>
                                    <p className="text-gray-700 leading-relaxed mb-6">{charity.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Mission</h3>
                                            <p className="text-gray-600">{charity.mission}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Vision</h3>
                                            <p className="text-gray-600">{charity.vision}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'programs' && (
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">Our Programs</h2>
                                    <div className="space-y-6">
                                        {charity.programs?.map((program, index) => (
                                            <div key={index} className="border-b pb-6 last:border-b-0">
                                                <h3 className="text-xl font-semibold mb-2">{program.name}</h3>
                                                <p className="text-gray-600 mb-4">{program.description}</p>
                                                {program.imageUrl && (
                                                    <img
                                                        src={program.imageUrl}
                                                        alt={program.name}
                                                        className="rounded-lg w-full h-48 object-cover mb-4"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'impact' && (
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">Our Impact</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {charity.impactStats?.map((stat, index) => (
                                            <div key={index} className="bg-blue-50 p-6 rounded-lg text-center">
                                                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                                                <div className="text-gray-600">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="prose max-w-none">
                                        {charity.impactDescription}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharityView;
