import React, { useEffect, useState } from "react";
import { usePage, router, Head, Link, useForm } from "@inertiajs/react";
//import Layout from "../Layout/Layout";
import { route } from "ziggy-js";
import axios from "axios";
import Select from "react-select";

export default function BranchAdminDashboard() {
    const { errors, flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        agent_id: "",
        zone_id: "",
    });

    const [agents, setAgents] = useState([]);
    const [zones, setZones] = useState([]);
    // const [selectedAgent, setSelectedAgent] = useState("");
    // const [selectedZones, setSelectedZones] = useState("");

    // Fetch zones once
    useEffect(() => {
        axios
            .get("/available/zones")
            .then((response) => {
                setZones(response.data.zones || response.data || []);
            })
            .catch((error) => {
                console.error("Error getting zones", error);
            });
    }, []); // ← correct place for dependency array

    // Fetch agents once
    useEffect(() => {
        axios
            .get("/available/agents")
            .then((response) => {
                setAgents(response.data.agents || []);
            })
            .catch((error) => {
                console.error("Error fetching agents", error);
            });
    }, []); // ← correct

    const submit = (e) => {
        e.preventDefault();
        router.post("/logout");
    };
    const submitZone = (e) => {
        e.preventDefault();
        post(route("assignAgents"));
    };

    const zoneOptions = zones.map((zone) => ({
        value: zone.zone_id,
        label: zone.zonename || zone.name,
    }));

    const agentOptions = agents.map((agent) => ({
        value: agent.user_id,
        label: agent.agentname,
    }));

    return (
        <main className="p-6">
            <Head title="Dashboard" />

            <h1 className="text-2xl font-bold mb-4">Branch Admin Dashboard</h1>

            <div>
                <h2>Assign Available Agents to Zones</h2>

                <form
                    onSubmit={submitZone}
                    className="mb-3 flex items-center gap-3"
                >
                    <Select
                        options={zoneOptions}
                        value={zoneOptions.find(
                            (z) => z.value === data.zone_id
                        )}
                        onChange={(option) => setData("zone_id", option.value)}
                        placeholder="Search or select zone"
                        className="w-64"
                    />

                    <Select
                        options={agentOptions}
                        value={agentOptions.find(
                            (a) => a.value === data.agent_id
                        )}
                        onChange={(option) => setData("agent_id", option.value)}
                        placeholder="Search or select agent"
                        className="w-64"
                    />

                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        type="submit"
                        disabled={processing}
                    >
                        Assign Zone
                    </button>
                </form>
            </div>

            {/* Error + Flash Messages */}
            {errors && Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <ul>
                        {Object.entries(errors).map(([key, message]) => (
                            <li key={key}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}

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
                className="border p-2 rounded mb-2 mr-1"
            >
                Create Branch Staffs
            </Link>

            <Link
                href={route("createzone")}
                className="border p-2 rounded mb-2 ml-1"
            >
                Create Zone
            </Link>
        </main>
    );
}

//BranchAdminDashboard.layout = (page) => <Layout>{page}</Layout>;
