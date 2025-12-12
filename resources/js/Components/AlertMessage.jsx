import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export default function AlertMessage() {
    const { props } = usePage();

    const success = props.flash?.success;
    const error = props.flash?.error;
    const errors = props.errors || {};

    // Local state for fade-out effect
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (success || error || Object.keys(errors).length > 0) {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [success, error, errors]);

    if (!success && !error && Object.keys(errors).length === 0) {
        return null; // Nothing to show
    }

    return (
        <div
            className={`transition-all duration-700 ease-in-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            } w-full mb-4`}
        >
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2">
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
                    {error}
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <ul>
                        {Object.entries(errors).map(([key, message]) => (
                            <li key={key}>• {message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
