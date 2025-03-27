import React from 'react';

const Modal = ({ isModalOpen, setIsModalOpen, children }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 text-3xl"
                    onClick={() => setIsModalOpen(false)}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;