import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../Layout/AdminLayout";
import { route } from "ziggy-js";

export default function AvailableUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        axios
            .get("/available/branchusers")
            .then((response) => {
                setUsers(response.data.users || []);
            })
            .catch((error) =>
                console.error("Error getting the users for this branch", error)
            )
            .finally(() => setLoading(false));
    };

    const toggleStatus = (user) => {
        setProcessingId(user.user_id);
        axios
            .patch(route("toggleuserStatus", user_id))
            .catch((err) => console.error(err));
    };

    const filteredUsers = users.filter((user) =>
        (user.full_name + " " + user.username)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <main className="page space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    Branch Users
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    List of all users for this branch. Use search to filter by
                    name or username.
                </p>
            </div>

            {/* Search Input */}
            <div className="max-w-md">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input w-full"
                />
            </div>

            {/* Users Table */}
            <div className="card overflow-x-auto">
                {loading ? (
                    <p className="text-[var(--color-text-muted)] p-4">
                        Loading users...
                    </p>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-[var(--color-text-muted)] p-4">
                        No users found.
                    </p>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead className="bg-[var(--color-primary)] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">
                                    Full Name
                                </th>
                                <th className="py-3 px-4 text-left">
                                    Username
                                </th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Phone</th>
                                <th className="py-3 px-4 text-left">
                                    Registered
                                </th>
                                <th className="py-3 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.user_id}
                                    className="border-b hover:bg-[var(--color-primary-light)] transition"
                                >
                                    <td className="py-2 px-4">
                                        {user.full_name}
                                    </td>
                                    <td className="py-2 px-4">
                                        {user.username}
                                    </td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4">
                                        {user.phone_number}
                                    </td>
                                    <td className="py-2 px-4">
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => toggleStatus(user.user_id)}
                                            disabled={
                                                processingId === user.user_id
                                            }
                                            className={`px-3 py-1 rounded text-white text-sm transition
                                                ${
                                                    user.status
                                                        ? "bg-[var(--color-danger)] hover:bg-red-700"
                                                        : "bg-[var(--color-success)] hover:bg-green-700"
                                                }`}
                                                
                                        >
                                            {processingId === user.user_id
                                                ? "Processing..."
                                                : user.status
                                                ? "Deactivate"
                                                : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}

AvailableUsers.layout = (page) => <AdminLayout>{page}</AdminLayout>;
