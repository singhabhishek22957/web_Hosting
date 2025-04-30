import React from 'react';
import { FaHeart, FaHandHoldingHeart, FaUsers, FaChartLine, FaLeaf, FaGlobe } from 'react-icons/fa';

const UnAuthorizedCharityIntro = () => {
    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Making a Difference Through Food Donation
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join us in our mission to reduce food wastage and help those in need across India
                    </p>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
                        <p className="text-gray-600">of food produced in India is wasted annually</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">194M</div>
                        <p className="text-gray-600">people in India are undernourished</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-4xl font-bold text-red-600 mb-2">67M</div>
                        <p className="text-gray-600">tonnes of food wasted in India each year</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Left Column */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">The Food Wastage Crisis in India</h2>
                        <div className="space-y-6">
                            <p className="text-gray-600">
                                India faces a paradoxical situation where millions go hungry while tons of food are wasted daily. 
                                According to the Food and Agriculture Organization (FAO), India ranks 94th out of 107 countries 
                                in the Global Hunger Index, despite being one of the world's largest food producers.
                            </p>
                            <p className="text-gray-600">
                                The food wastage occurs at various stages - from production and storage to distribution and consumption. 
                                This wastage not only impacts food security but also contributes to environmental degradation and 
                                economic losses.
                            </p>
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-blue-800 mb-3">Key Challenges</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>Inadequate storage facilities</li>
                                    <li>Poor transportation infrastructure</li>
                                    <li>Lack of awareness about food preservation</li>
                                    <li>Inefficient supply chain management</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">How You Can Help</h2>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <FaHeart className="text-red-500 text-2xl mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Donate Excess Food</h3>
                                    <p className="text-gray-600">
                                        Instead of throwing away excess food, donate it to those in need. 
                                        Your contribution can make a significant difference in someone's life.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <FaHandHoldingHeart className="text-green-500 text-2xl mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Support Food Banks</h3>
                                    <p className="text-gray-600">
                                        Contribute to food banks and organizations that work to distribute 
                                        food to underprivileged communities.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <FaUsers className="text-blue-500 text-2xl mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Volunteer</h3>
                                    <p className="text-gray-600">
                                        Join our network of volunteers to help collect, sort, and distribute 
                                        food to those in need.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Impact Section */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <FaChartLine className="text-4xl text-blue-600 mx-auto mb-4" />
                            <div className="text-2xl font-bold text-gray-800 mb-2">50,000+</div>
                            <p className="text-gray-600">Meals Distributed Monthly</p>
                        </div>
                        <div className="text-center">
                            <FaLeaf className="text-4xl text-green-600 mx-auto mb-4" />
                            <div className="text-2xl font-bold text-gray-800 mb-2">100+</div>
                            <p className="text-gray-600">Partner Organizations</p>
                        </div>
                        <div className="text-center">
                            <FaGlobe className="text-4xl text-purple-600 mx-auto mb-4" />
                            <div className="text-2xl font-bold text-gray-800 mb-2">25+</div>
                            <p className="text-gray-600">Cities Covered</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Be Part of the Solution</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join our community of donors and volunteers to make a real difference in the lives of those in need.
                    </p>
                    <div className="space-x-4">
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                            Start Donating
                        </button>
                        <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnAuthorizedCharityIntro;
