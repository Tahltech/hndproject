import React, { useState, useEffect } from "react";
import { usePage, router, Link, Head } from "@inertiajs/react";
import Layout from "../Layout/Layout";
import { route } from "ziggy-js";
import axios from "axios";
export default function Admindashboard() {
    const { errors, flash } = usePage().props;
    const [branches, setBranches] = useState([]);
    const [bankName, setBankName] = useState("");

    useEffect(() => {
        axios.get("/available/branch").then((response) => {
            const branches = response.data.branches || [];
            setBranches(branches);

            if (branches.length > 0) {
                setBankName(branches[0].bank_name || "");
            }
        });
    }, []);

    const submit = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <main className="p-6">
            <Head title="Dashboard" />
            <h1 className="text-2xl font-bold mb-4">Bank Admin Dashboard for {bankName}</h1>
            <br />
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
                    className="bg-green-600 text-white mb-2 px-4 py-2 rounded hover:bg-green-700"
                >
                    Logout
                </button>
            </form>

            <div>
                <Link
                    href={route("createbranch")}
                    className="bg-green-600 mt-2 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Create Branch
                </Link>
            </div>

            <div className="p-6">
                <h2 className="text-xl mb-2">Available Branches</h2>
                <ul>
                    {branches.map((branch, i) => (
                        <Link
                            key={branch.branch_id}
                            href={route("createbranchadmin", branch.branch_id)}
                            className="border p-2 rounded mb-2 mr-1"
                        >
                            {branch.name}
                        </Link>
                    ))}
                </ul>
            </div>
        </main>
    );
}
Admindashboard.layout = (page) => <Layout>{page}</Layout>;
