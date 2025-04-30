import React, { useState } from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-400">CharityConnect India</h3>
            <p className="text-gray-400">
              Bridging the gap between donors and charities across India. Join us in supporting the underserved and making a positive impact in society.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><FaFacebook className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><FaTwitter className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><FaInstagram className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><FaLinkedin className="text-xl" /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors"><FaYoutube className="text-xl" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Charities</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Donate</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-green-400 mt-1" />
                <span className="text-gray-400">CharityConnect India, Sahastradhara Road, Dehradun, Uttarakhand 248001</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-green-400" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-green-400" />
                <span className="text-gray-400">support@charityconnect.in</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates about our charity events, volunteer opportunities, and impact stories from across India.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CharityConnect India. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
