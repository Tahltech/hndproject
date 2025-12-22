import React from "react";
import Toast from "../../Components/Toast";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <Toast />

            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}

