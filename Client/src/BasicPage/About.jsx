import React from 'react';
import { FaHandshake, FaHeart, FaUsers, FaChartLine, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">About CharityConnect</h1>
                        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                            Connecting hearts and creating impact through technology and compassion.
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10"></div>
            </section>

            {/* Our Story */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                            <p className="text-lg text-gray-600">
                                CharityConnect was born from a simple idea: to make charitable giving more accessible, transparent, and impactful. Founded in 2023, our platform bridges the gap between generous donors and trustworthy charities.
                            </p>
                            <p className="text-lg text-gray-600">
                                What started as a small team of passionate individuals has grown into a global movement, connecting millions of donors with thousands of verified charities worldwide.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-100 rounded-3xl transform -rotate-3"></div>
                            <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                                    alt="Our Team" 
                                    className="rounded-2xl w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <div className="flex items-center mb-6">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <FaHeart className="text-2xl text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                            </div>
                            <p className="text-gray-600">
                                To create a world where every act of giving makes a meaningful impact. We strive to build trust, foster transparency, and empower both donors and charities to create positive change in their communities.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <div className="flex items-center mb-6">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <FaLightbulb className="text-2xl text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                            </div>
                            <p className="text-gray-600">
                                To be the most trusted and impactful platform connecting donors with charities worldwide, revolutionizing how people give and how charities operate in the digital age.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaHandshake className="text-4xl text-green-500" />,
                                title: "Trust",
                                description: "We build and maintain trust through transparency and accountability in all our operations."
                            },
                            {
                                icon: <FaUsers className="text-4xl text-green-500" />,
                                title: "Community",
                                description: "We foster a strong community of donors, charities, and volunteers working together."
                            },
                            {
                                icon: <FaShieldAlt className="text-4xl text-green-500" />,
                                title: "Integrity",
                                description: "We uphold the highest standards of ethical conduct and professional excellence."
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                                <div className="mb-6">{value.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The passionate individuals behind CharityConnect
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Johnson",
                                role: "Founder & CEO",
                                image: "https://images.unsplash.com/photo-1573497019940-1c28c88f4f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            },
                            {
                                name: "Michael Chen",
                                role: "CTO",
                                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            },
                            {
                                name: "David Wilson",
                                role: "Head of Operations",
                                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            }
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                                    <p className="text-gray-600">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Us Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
                    <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
                        Be part of our journey to create a better world through technology and compassion.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                            Join Our Team
                        </button>
                        <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                            Partner With Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
