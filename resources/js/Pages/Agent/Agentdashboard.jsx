import { route } from "ziggy-js";
import AdminLayout from "../Layout/AdminLayout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useForm, Link, Head, usePage } from "@inertiajs/react";

export default function AgentDashboard() {
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const { props } = usePage();
    const user = props.auth?.user;

    const { data, setData, post, processing } = useForm({
        user_id: "",
        type: "",
        amount: "",
    });

    useEffect(() => {
        axios.get("/agentadmindashboard/agent/clients").then((res) => {
            setClients(res.data.clients || []);
        });

        axios.get("/available/branchusers").then((res) => {
            const branchusers = res.data.data;
            setUsers(branchusers || []);
        });
    }, []);

    const clientOptions = clients.map((c) => ({
        value: c.user_id,
        label: c.full_name,
    }));

    const userOptions = users.map((u) => ({
        value: u.user_id,
        label: `${u.full_name} (${u.username})`,
    }));

    const handleZoneAction = (action) => {
        if (!data.user_id) return alert("Please select a user");

        post(route(action === "add" ? "alterZone" : "removeZone"));
    };

    const handleTransaction = (action) => {};
    return (
        <>
            <Head title="Agent Dashboard" />

            {/* Header */}
            <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
                    {/* Page title / welcome */}
                    <div className="order-2 sm:order-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                            Agent Dashboard
                        </h1>
                        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-1">
                            Manage client savings and zone users
                        </p>
                    </div>

                    <div className="order-1 sm:order-2 flex justify-end">
                        <div className="flex items-center gap-3 group">
                            <div className="text-right leading-tight">
                                <p className="text-sm font-semibold">
                                    {user?.bank?.bank_name || "Bank Name"}
                                </p>
                                <p className="text-xs text-[var(--color-primary)]">
                                    {user?.role.name}
                                </p>
                            </div>

                            <div
                                className="
                        w-10 h-10 rounded-full overflow-hidden
                        bg-[var(--color-primary-light)]
                        flex items-center justify-center
                        group-hover:ring-2 group-hover:ring-[var(--color-primary)]
                        transition"
                            >
                                <img
                                    src={
                                        user?.bank?.bank_profile
                                            ? `/storage/bank_logos/${user.bank?.bank_profile}`
                                            : "/storage/profile_photos/default-avatar.png"
                                    }
                                    alt={user?.bank?.bank_name || "Bank Logo"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Client Savings */}
                {/* Add Client Savings */}
                <div className="card">
                    <h3 className="text-xl font-semibold mb-4">
                        Add Client Savings
                    </h3>

                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();

                            if (!data.user_id)
                                return alert("Please select a client");
                            if (!data.amount || data.amount <= 0)
                                return alert("Enter a valid amount");

                            // Post to savings route
                            post(route("cashsavings"), {
                                data,
                                onError: (err) => {
                                    alert("Something went wrong");
                                },
                            });
                        }}
                    >
                        <div>
                            <label className="label">Client</label>
                            <Select
                                options={clientOptions}
                                className="text-[var(--color-text-primary)]"
                                onChange={(opt) =>
                                    setData("user_id", opt.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="label">Type</label>
                            <Select
                                options={[
                                    { value: "deposit", label: "Deposit" },
                                    { value: "withdraw", label: "Withdraw" },
                                ]}
                                className="text-[var(--color-text-primary)]"
                                placeholder="Select transaction type"
                                onChange={(opt) => setData("type", opt.value)}
                            />
                        </div>

                        <div>
                            <label className="label">Amount (XAF)</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="Enter savings amount"
                                value={data.amount}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-full"
                            disabled={processing}
                        >
                            {processing ? "Saving..." : "Submit Savings"}
                        </button>
                    </form>
                </div>

                {/* Zone Management */}
                <div className="card">
                    <h3 className="text-xl font-semibold mb-4">
                        Zone Management
                    </h3>

                    <form className="flex flex-col gap-4">
                        <div>
                            <label className="label">Select User</label>
                            <Select
                                options={userOptions}
                                onChange={(opt) =>
                                    setData("user_id", opt.value)
                                }
                                placeholder="Search user..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleZoneAction("add")}
                                className="btn btn-success flex-1"
                            >
                                Add to Zone
                            </button>

                            <button
                                type="button"
                                onClick={() => handleZoneAction("remove")}
                                className="btn btn-danger flex-1"
                            >
                                Remove
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer action */}
            <div className="mt-8">
                <Link
                    href={route("availableusers")}
                    className="btn btn-secondary"
                >
                    View Available Users
                </Link>
            </div>
        </>
    );
}

AgentDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
