import React, { useState } from 'react';
import { FaHandHoldingHeart, FaUsers, FaChartLine, FaSearch, FaDonate, FaHeart, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useCharity } from '../Context/CharityContext';

const LandingFood = () => {
    const navigate = useNavigate();
    const {charity} = useCharity();
    const { user } = useUser();
    const [errorHandle, setErrorHandle] = useState({
        error: false,
        message: '',
        title: ''
    });
    const [successHandle, setSuccessHandle] = useState({
        success: false,
        message: '',
        title: ''
    });

    const handleGetStarted = async (e) => {
        e.preventDefault();

        const userType = localStorage.getItem('role');
        if (userType === 'user') {
            if (user?.name) {
                navigate('/donation/create');
            } else {
                navigate('/login');
            }
        } else if (userType === 'charity') {
            if(charity?.name) {
                navigate('/get-donation');
            }else{
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h1 className="text-5xl font-bold leading-tight">
                                Connecting Hearts, <br />
                                <span className="text-yellow-300">Changing Lives</span>
                            </h1>
                            <p className="text-xl text-gray-100">
                                Join our platform to make a difference. Connect with charities, donate to causes you care about, and help create a better world.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleGetStarted}
                                 className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                                    Get Started
                                </button>
                                <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/10 rounded-3xl transform rotate-3"></div>
                            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                                    alt="Charity Connect" 
                                    className="rounded-2xl w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CharityConnect?</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our platform makes it easy to connect with charities and make a meaningful impact.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaHandHoldingHeart className="text-4xl text-green-500" />,
                                title: "Easy Donations",
                                description: "Simple and secure donation process with multiple payment options."
                            },
                            {
                                icon: <FaUsers className="text-4xl text-green-500" />,
                                title: "Verified Charities",
                                description: "All charities are thoroughly vetted to ensure transparency and trust."
                            },
                            {
                                icon: <FaChartLine className="text-4xl text-green-500" />,
                                title: "Track Impact",
                                description: "See how your contributions make a difference with detailed reports."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "500+", label: "Charities" },
                            { number: "1M+", label: "Donors" },
                            { number: "$50M+", label: "Raised" },
                            { number: "100+", label: "Countries" }
                        ].map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <div className="text-4xl font-bold">{stat.number}</div>
                                <div className="text-lg text-green-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Three simple steps to make a difference
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaSearch className="text-4xl text-green-500" />,
                                title: "Find a Cause",
                                description: "Browse through verified charities and find causes that resonate with you."
                            },
                            {
                                icon: <FaDonate className="text-4xl text-green-500" />,
                                title: "Make a Donation",
                                description: "Choose your donation amount and payment method."
                            },
                            {
                                icon: <FaHeart className="text-4xl text-green-500" />,
                                title: "Track Impact",
                                description: "Receive updates on how your contribution is making a difference."
                            }
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white p-8 rounded-2xl shadow-lg">
                                    <div className="mb-6">{step.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2">
                                        <FaArrowRight className="text-2xl text-gray-400" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hear from people who have made a difference through our platform
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "CharityConnect made it so easy to find and support causes I care about. The transparency is amazing!",
                                author: "Sarah Johnson",
                                role: "Regular Donor"
                            },
                            {
                                quote: "As a charity, this platform has helped us reach more donors and make a bigger impact in our community.",
                                author: "Michael Chen",
                                role: "Charity Director"
                            },
                            {
                                quote: "I love being able to track how my donations are being used. It's truly rewarding to see the impact.",
                                author: "David Wilson",
                                role: "Monthly Supporter"
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                                <FaQuoteLeft className="text-4xl text-green-500 mb-6" />
                                <p className="text-gray-600 mb-6">{testimonial.quote}</p>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                                    <p className="text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
                    <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
                        Join thousands of donors and charities making a positive impact in the world.
                    </p>
                    <button 
                    onClick={handleGetStarted}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                        Get Started Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingFood;
