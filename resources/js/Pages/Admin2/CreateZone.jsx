import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function () {
    const { data, setData, post } = useForm({
        zoneName: "",
    });

    const submitZone = (e) => {
        e.preventDefault();
        post(route("savezone"));
    };

    const logout = (e) => {
        e.preventDefault();
        post(route("logout"));
    };

    return (
        <>
            <h2 className="mb-19">Welcome </h2>

            {/* Zone Creation Form */}
            <form onSubmit={submitZone} className="w-100">
                <p className="font-bold">Enter the Zone Name</p>

                <input
                    type="text"
                    value={data.zoneName}
                    placeholder="Enter Zone Name"
                    onChange={(e) => setData("zoneName", e.target.value)}
                    className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-3"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4 w-full"
                >
                    Create Zone
                </button>
            </form>

            {/* Logout Form */}
            <form onSubmit={logout}>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-3"
                >
                    Logout
                </button>
            </form>
        </>
    );
}