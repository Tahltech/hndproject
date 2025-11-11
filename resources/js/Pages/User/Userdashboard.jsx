import React, { useEffect, useState } from "react";
import { usePage, router, Head, Link } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { route } from "ziggy-js";

export default function Userdashboard() {
    const { errors, flash } = usePage().props;
    const [ballance, setBallance] = useState([]);
    const [showBallance, setShowBallance] = useState(false);
    const [message, setMessage] = useState(flash.success || flash.error);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        axios
            .get("/account/ballance")
            .then((response) => {
                const ballance = response.data.ballance || [];
                setBallance(ballance);
            })
            .catch((error) => {
                console.error("Error fetching balance:", error);
            });
    }, []);

    const submit = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <main className="p-6">
            <Head title="Dashboard" />
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

            {/* Show errors if any */}
            {errors && Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <ul>
                        {Object.entries(errors).map(([key, message]) => (
                            <li key={key}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto mt-10 mb-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Main Balance
                    </h2>

                    {/* Balance section with toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                            XAF{" "}
                            {showBallance
                                ? ballance[0]?.ballance || 0
                                : "*****"}
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowBallance(!showBallance)}
                            className="text-gray-600 hover:text-gray-800 transition"
                        >
                            {showBallance ? (
                                <EyeOff size={22} />
                            ) : (
                                <Eye size={22} />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between gap-4">
                    <Link
                        href={route("addballance")}
                        className="flex-1 bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-all duration-200"
                    >
                        Add Savings
                    </Link>
                    <Link
                        href={route("withdraw")}
                        className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-red-700 transition-all duration-200"
                    >
                        Withdraw Savings
                    </Link>
                </div>
            </div>

            {/* Show flash message if Laravel set one */}
            {flash?.error && (
                <div className="bg-red-200 text-red-700 px-3 py-2 rounded mb-4">
                    {flash.error}
                </div>
            )}
            {flash?.success && (
                <div className="bg-green-200 text-green-700 px-3 py-2 rounded mb-4">
                    {flash.success}
                </div>
            )}

            <form onSubmit={submit}>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Logout
                </button>
            </form>
        </main>
    );
}
Userdashboard.layout = (page) => <Layout>{page}</Layout>;
