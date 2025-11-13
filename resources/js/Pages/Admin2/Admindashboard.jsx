import React, { useEffect, useState } from "react";
import { usePage, router, Head, Link } from "@inertiajs/react";
import Layout from "../Layout/Layout";
import { route } from "ziggy-js";
import axios from "axios";

export default function branchAdminDashboard() {
    const { errors, flash } = usePage().props;
    const [agents, setAgents] = useState([]);

    const submit = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    useEffect(() => {
        axios
            .get("available/agents")
            .then((response) => {
                setAgents(response.data.agents || []);
            })
            .catch((error) => {
                console.error("Error fetching agents", error);
            }, []);
    });

    return (
        <main className="p-6">
            <Head title="Dashboard" />
            <h1 className="text-2xl font-bold mb-4">Branch Admin Dashboard</h1>
            <div>
                <h2>Available Agents</h2>
                <ul>
                    {agents.map((agent) => (
                        <li
                        className="m-1" key={agent.id}>{agent.agentname}</li>
                    ))}
                </ul>
            </div>

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
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-3"
                >
                    Logout
                </button>
            </form>

            <Link
                href={route("createstaff")}
                className="border p-2 rounded mb-2 mr-1 mt-100"
            >
                Create Branch Staffs
            </Link>
            <Link
                href={route("createzone")}
                className="border p-2 rounded mb-2 mr-1 mt-100"
            >
                Create Zone
            </Link>
        </main>
    );
}
branchAdminDashboard.layout = (page) => <Layout>{page}</Layout>;
