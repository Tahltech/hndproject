import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export default function Toast() {
    const { props } = usePage();

    const success = props.flash?.success;
    const error = props.flash?.error;
    const errors = props.errors || {};

    const [toasts, setToasts] = useState([]);

    // Push messages into toast list
    useEffect(() => {
        let newToasts = [];

        if (success) {
            newToasts.push({ type: "success", message: success });
        }

        if (error) {
            newToasts.push({ type: "error", message: error });
        }

        // Validation errors
        Object.values(errors).forEach((msg) => {
            newToasts.push({ type: "error", message: msg });
        });

        if (newToasts.length > 0) {
            setToasts((prev) => [...prev, ...newToasts]);
        }
    }, [success, error, errors]);

    // Auto-remove after 3 seconds
    useEffect(() => {
        if (toasts.length === 0) return;

        const timer = setTimeout(() => {
            setToasts((prev) => prev.slice(1)); // remove first toast
        }, 3000);

        return () => clearTimeout(timer);
    }, [toasts]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 z-[9999] space-y-3">
            {toasts.map((toast, i) => (
                <div
                    key={i}
                    className={`
                        max-w-sm px-4 py-3 rounded-lg shadow-lg text-white
                        transition-all duration-500 ease-in-out
                        transform bg-opacity-90
                        ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}

                        animate-slide-in
                    `}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
