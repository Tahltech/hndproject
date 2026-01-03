import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Toast from "../../Components/Toast";
import { ToastProvider } from "../../Components/ToastContext";

export default function AuthLayout({ children }) {
    const { props } = usePage();

    // Debug: log flash props
    useEffect(() => {
        console.log("Inertia flash props:", props.flash);
    }, [props.flash]);

    return (
        <ToastProvider>
             {/* Must be inside the provider to see context */}
            <div className="min-h-screen flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">{children}</div>
            </div>
            <Toast />
        </ToastProvider>
    );
}
