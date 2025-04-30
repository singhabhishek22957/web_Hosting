import React, { useEffect } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const ErrorPopUp = ({ isOpen, onClose, message, title = "Error" }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
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
                        <div className="bg-red-100 p-2 rounded-full">
                            <FaExclamationTriangle className="text-red-500 text-xl" />
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
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopUp;
