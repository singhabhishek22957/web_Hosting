import React from 'react';

const ErrorPopUp = ({ isOpen, onClose, message, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-red-600 mb-4">{title || 'Error'}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopUp; 