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
        const newToasts = [];

        if (success) {
            newToasts.push({ type: "success", message: success });
        }

        if (error) {
            newToasts.push({ type: "danger", message: error });
        }

        Object.values(errors).forEach((msg) => {
            newToasts.push({ type: "danger", message: msg });
        });

        if (newToasts.length > 0) {
            setToasts((prev) => [...prev, ...newToasts]);
        }
    }, [success, error, errors]);

    // Auto-remove after 3 seconds
    useEffect(() => {
        if (toasts.length === 0) return;

        const timer = setTimeout(() => {
            setToasts((prev) => prev.slice(1));
        }, 3000);

        return () => clearTimeout(timer);
    }, [toasts]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 z-[9999] space-y-3 w-full max-w-sm">
            {toasts.map((toast, i) => (
                <div
                    key={i}
                    className={`
                        relative overflow-hidden
                        px-4 py-3 rounded-xl shadow-lg
                        transition-all duration-500 ease-in-out
                        animate-slide-in
                        bg-[var(--color-surface)]
                        border
                        ${
                            toast.type === "success"
                                ? "border-l-4 border-[var(--color-success)]"
                                : "border-l-4 border-[var(--color-danger)]"
                        }
                    `}
                >
                    <p
                        className={`
                            text-sm font-medium
                            ${
                                toast.type === "success"
                                    ? "text-[var(--color-success)]"
                                    : "text-[var(--color-danger)]"
                            }
                        `}
                    >
                        {toast.message}
                    </p>
                </div>
            ))}
        </div>
    );
}
