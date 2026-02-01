import { route } from "ziggy-js";
import AdminLayout from "../Layout/AdminLayout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useForm, Link, Head } from "@inertiajs/react";
import AlertMessage from "@/Components/AlertMessage";

export default function AgentDashboard() {
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, setData, post, processing } = useForm({
        user_id: "",
        amount: "",
    });

    // Fetch clients under this agent's zone
    useEffect(() => {
        axios.get("/agent/clients").then((res) => {
            setClients(res.data.clients || []);
        });
    }, []);

    const clientOptions = (clients || []).map((client) => ({
        value: client.user_id,
        label: client.full_name,
    }));

    // Logout
    const submitLogout = (e) => {
        e.preventDefault();
        post("/logout");
    };

    // Fetch all users of branch (to add to zone)
    useEffect(() => {
        axios
            .get("/available/branchusers")
            .then((response) => {
                setUsers(response.data.users || []);
            })
            .catch((error) => {
                console.error("Error getting the users for this branch", error);
            });
    }, []);

    const userOptions = (users || []).map((user) => ({
        value: user.user_id,
        label: `${user.full_name} (${user.username})`,
    }));

    // Submit selected user to zone
    const handleZoneAction = (action) => {
        if (!data.user_id) {
            alert("Please select a user");
            return;
        }

        if (action === "add") {
            post(route("alterZone")); 
        } else if (action === "remove") {
            post(route("removeZone")); 
        }
    };

    return (
        <>
            <h2 className="mb-6 text-2xl font-bold">Welcome Agent Dashboard</h2>
             <Head title="Dashboard" />
            <AlertMessage />

           
            <div className="p-4 bg-white shadow rounded-lg w-full max-w-md mb-6">
                <h3 className="text-xl font-bold mb-4">Add Client Savings</h3>

                <form>
                    <label className="font-semibold">Select Client</label>
                    <Select
                        options={clientOptions}
                        onChange={(opt) => setData("user_id", opt.value)}
                        className="mb-3"
                    />

                    <label className="font-semibold">Amount</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded mb-3"
                        placeholder="Enter savings amount"
                        onChange={(e) => setData("amount", e.target.value)}
                    />

                    <button
                        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
                        disabled={processing}
                    >
                        Submit Savings
                    </button>
                </form>
            </div>

            <div className="mt-5">
                <Link
                    href={route("availableusers")}
                    className="font-bold text-blue-600 bg-white px-5 rounded py-2 mb-5 mt-4 shadow"
                >
                    Available Users
                </Link>
            </div>

          
            <div className="mt-8 p-4 bg-white shadow rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">
                    Add User to Your Zone
                </h3>

                <form>
                    <label className="font-semibold">Select User</label>
                    <Select
                        options={userOptions}
                        onChange={(opt) => setData("user_id", opt.value)}
                        placeholder="Search or select user..."
                        className="mb-4"
                    />

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleZoneAction("add")}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
                        >
                            Add To Zone
                        </button>

                        <button
                            type="button"
                            onClick={() => handleZoneAction("remove")}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
                        >
                            Remove From Zone
                        </button>
                    </div>
                </form>
            </div>

            
            <form onSubmit={submitLogout} className="mt-6">
                <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </form>
        </>
    );
}

AgentDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
