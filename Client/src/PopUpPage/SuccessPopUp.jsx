import React, { useEffect } from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa'; // Changed icon for success

const SuccessPopUp = ({ isOpen, onClose, message, title = "Success" }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent body scroll when popup is open
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset'; // Restore body scroll when popup is closed
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <FaCheckCircle className="text-green-500 text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-center capitalize">
                    <p className="text-gray-600">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPopUp;
