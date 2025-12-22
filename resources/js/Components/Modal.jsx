import React from "react";

export default function Modal({ show, children, onClose }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-full">
            {/* Transparent backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"
            />

            {/* Modal content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
                {/* Close button */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Modal children */}
                {children}
            </div>
        </div>
    );
}

