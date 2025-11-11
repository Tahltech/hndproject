import React, { useState, useEffect } from "react";
import { usePage, router, Link ,Head} from "@inertiajs/react";
import Layout from "../Layout/Layout";
import { route } from "ziggy-js";
import axios from "axios";

export default function Admindashboard() {
    const { errors, flash } = usePage().props;
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        axios
            .get("/admin/banks").then((response) => {
                // Ensure we always get an array
                setBanks(response.data.banks || []);
            })
            .catch((error) => {
                console.error("Error fetching banks:", error);
            });
    }, []);

    const submit = (e) => {
        e.preventDefault();
        router.post("/logout");
    };
    return (
        <main className="p-6">
             <Head title="Dashboard" />
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

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
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
                >
                    Logout
                </button>
            </form>

            <Link
                href={route("createbank")}
                className="mt-7 px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300 ease-in-out mb-4"
            >
                Create Bank
            </Link>

            {/* bank information  */}

            <div className="p-6">
                <h2 className="text-xl mb-2">Available Banks</h2>
                <ul>
                    {banks.map((bank, i) => (

                        <Link
                            key={bank.bank_id}
                            href={route("create.admin", bank.bank_id)}
                            className="border p-2 rounded mb-2 mr-1"
                        >
                            {bank.name}
                        </Link>
                    ))}
                </ul>
            </div>
        </main>
    );
}
Admindashboard.layout = (page) => <Layout>{page}</Layout>;
