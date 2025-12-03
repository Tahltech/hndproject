import React from "react";
import { usePage } from "@inertiajs/react";

export default function AlertMessage() {
    const { props } = usePage();

    const success = props.flash?.success;
    const error = props.flash?.error;
    const errors = props.errors || {};

    return (
        <div className="w-full mb-4">
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

            {/* Validation Errors */}
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
