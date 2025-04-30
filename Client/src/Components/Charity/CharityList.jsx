import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CharityCard from './CharityCard';
import { FaSearch, FaHeart, FaHandHoldingHeart, FaUsers, FaBuilding, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { useUser } from '../../Context/UserContext';
import { useCharity } from '../../Context/CharityContext';

const CharityList = () => {
    const [charities, setCharities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();
    const { charity } = useCharity();

    useEffect(() => {
        const fetchCharities = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/charities');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setCharities(data);
            } catch (err) {
                console.error('Error fetching charities:', err);
                setError('Failed to fetch charities. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharities();
    }, []);

    const filteredCharities = charities.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mission?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.vision?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <p className="text-xl font-semibold mb-2">Error</p>
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Verified Charities</h1>
                        <p className="text-xl md:text-2xl mb-8">Join us in making a difference through verified charitable organizations</p>
                        {!user && !charity && (
                            <div className="space-x-4">
                                <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
                                    Get Started
                                </Link>
                                <Link to="/login" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Why Support Verified Charities?</h2>
                        <p className="text-gray-600 mb-6">
                            Every registered charity on our platform is verified and committed to making a real impact in their communities.
                        </p>
                        <div className="space-y-4">
                            <Feature 
                                icon={<FaBuilding className="text-red-500" />} 
                                title="Verified Organizations" 
                                desc="All charities are registered and verified for transparency." 
                            />
                            <Feature 
                                icon={<FaHandHoldingHeart className="text-green-500" />} 
                                title="Direct Impact" 
                                desc="Your support goes directly to those in need." 
                            />
                            <Feature 
                                icon={<FaUsers className="text-blue-500" />} 
                                title="Community Trust" 
                                desc="Join a network of trusted charitable organizations." 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img 
                            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=60" 
                            alt="Charity work" 
                            className="rounded-lg shadow-lg" 
                        />
                        <img 
                            src="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=500&q=60" 
                            alt="Community support" 
                            className="rounded-lg shadow-lg mt-8" 
                        />
                    </div>
                </div>
            </div>

            {/* Search and Results */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="max-w-xl mx-auto">
                        <InputWithIcon
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search charities by name, description, mission, or vision..."
                            icon={<FaSearch />}
                        />
                    </div>
                </div>

                <p className="mb-4 text-gray-600">
                    Showing {filteredCharities.length} verified charities
                </p>

                {filteredCharities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCharities.map(charity => (
                            <CharityCard 
                                key={charity._id} 
                                charity={{
                                    ...charity,
                                    contactInfo: {
                                        phone: charity.phoneNumbers?.[0],
                                        email: charity.email,
                                        website: charity.website,
                                        address: charity.address
                                    },
                                    socialLinks: charity.socialLinks,
                                    isVerified: charity.registeredNGO
                                }} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">No charities found matching your search.</p>
                    </div>
                )}
            </div>

            {/* CTA */}
            {!user && !charity && (
                <div className="bg-blue-600 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
                        <p className="text-xl mb-8">Join our community of donors and support verified charities.</p>
                        <div className="space-x-4">
                            <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">Register Now</Link>
                            <Link to="/login" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">Login</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Subcomponents for cleaner code
const InputWithIcon = ({ value, onChange, placeholder, icon }) => (
    <div className="relative">
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
    </div>
);

const Feature = ({ icon, title, desc }) => (
    <div className="flex items-start">
        <div className="mt-1 mr-3">{icon}</div>
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    </div>
);

export default CharityList;
