import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';

const CharityCard = ({ charity }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Card Header with Logo */}
            <div className="relative h-48 bg-gray-100">
                {charity?.logoUrl ? (
                    <img
                        src={charity.logoUrl}
                        alt={charity.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-4xl text-gray-400">🏥</span>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-6">
                {/* Charity Name and Category */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{charity.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {charity.category}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {charity.description}
                </p>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                    {charity.address && (
                        <div className="flex items-center text-gray-600">
                            <FaMapMarkerAlt className="mr-2 text-red-500" />
                            <span className="text-sm">{charity.address}</span>
                        </div>
                    )}
                    {charity.phone && (
                        <div className="flex items-center text-gray-600">
                            <FaPhone className="mr-2 text-green-500" />
                            <span className="text-sm">{charity.phone}</span>
                        </div>
                    )}
                    {charity.email && (
                        <div className="flex items-center text-gray-600">
                            <FaEnvelope className="mr-2 text-blue-500" />
                            <span className="text-sm">{charity.email}</span>
                        </div>
                    )}
                    {charity.website && (
                        <div className="flex items-center text-gray-600">
                            <FaGlobe className="mr-2 text-purple-500" />
                            <a 
                                href={charity.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Visit Website
                            </a>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                    <Link
                        to={`/charity/${charity._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                        View Details
                    </Link>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
                    >
                        Donate Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharityCard;
