import React, { useState  } from 'react';
import { FaUser, FaBuilding, FaTimes } from 'react-icons/fa';

const RegisterPop = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('user');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Register</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
                            activeTab === 'user'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('user')}
                    >
                        <FaUser />
                        User Registration
                    </button>
                    <button
                        className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
                            activeTab === 'charity'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('charity')}
                    >
                        <FaBuilding />
                        Charity Registration
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {activeTab === 'user' ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">User Registration</h3>
                            <p className="text-gray-600">Register as a regular user to donate food or request food donations.</p>
                            <button
                                onClick={() => window.location.href = '/user/register'}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                            >
                                Continue to User Registration
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Charity Registration</h3>
                            <p className="text-gray-600">Register as a charity organization to receive and distribute food donations.</p>
                            <button
                                onClick={() => window.location.href = '/charity/register'}
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                            >
                                Continue to Charity Registration
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPop;
