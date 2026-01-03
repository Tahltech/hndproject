import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";
import { route } from "ziggy-js";
import { Head, router } from "@inertiajs/react";
import Toast from "../../Components/Toast";
import { useToast } from "@/Components/ToastContext";


export default function AvailableUsers() {
     const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = () => {
        setLoading(true);
        axios
            .get("/available/branchusers", { params: { page, search } })
            .then((res) => {
                setUsers(res.data.data || []);
                setMeta(res.data.meta || {});
            })
            .finally(() => setLoading(false));
    };

   const toggleStatus = (user) => {
    setProcessingId(user.user_id);

    axios
        .patch(route("toggleuserStatus", user.user_id))
        .then((res) => {
            const updatedUser = res.data.user;

            // Update local state immediately
            setUsers((prev) =>
                prev.map((u) =>
                    u.user_id === updatedUser.user_id ? updatedUser : u
                )
            );

            addToast(res.data.message || "Status updated successfully", "success");
        })
        .catch((err) => {
            const message =
                err.response?.data?.message ||
                "Something went wrong. Please try again.";

            addToast(message, "danger");
        })
        .finally(() => setProcessingId(null));
};


    return (
        <main className="page space-y-6">
            <Head title="Branch Users" />

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    Branch Users
                </h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Manage registered users under this branch
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Icon
                    name="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                />
                <input
                    type="text"
                    placeholder="Search by name, username or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="input pl-10"
                />
            </div>

            {/* ================= DESKTOP TABLE ================= */}
            <div className="card overflow-x-auto hidden md:block">
                {loading ? (
                    <p className="p-4 text-muted">Loading users…</p>
                ) : users.length === 0 ? (
                    <p className="p-4 text-muted">No users found</p>
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="bg-[var(--color-primary-light)]">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">
                                    Username
                                </th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.user_id}
                                    className="border-b hover:bg-[var(--color-primary-light)] transition"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {user.full_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.username}
                                    </td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        {user.phone_number}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`badge ${
                                                user.status === "active"
                                                    ? "badge-success"
                                                    : "badge-warning"
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1 flex-wrap md:flex-nowrap">
                                            <a
                                                href={route(
                                                    "branch.users.view",
                                                    user.user_id
                                                )}
                                                className="btn btn-outline px-2 py-1 text-xs flex items-center gap-1"
                                            >
                                                <Icon
                                                    name="eye"
                                                    className="w-3 h-3"
                                                />
                                                View
                                            </a>
                                            <button
                                                onClick={() =>
                                                    toggleStatus(user)
                                                }
                                                disabled={
                                                    processingId ===
                                                    user.user_id
                                                }
                                                className="btn btn-danger px-2 py-1 text-xs flex items-center gap-1"
                                            >
                                                {processingId === user.user_id
                                                    ? "…"
                                                    : user.status === "active"
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="space-y-4 md:hidden">
                {users.length === 0 && !loading && (
                    <p className="text-center text-muted">No users found</p>
                )}
                {users.map((user) => (
                    <div key={user.user_id} className="card p-4 space-y-2">
                        <div className="font-semibold">{user.full_name}</div>
                        <div className="text-sm text-muted">
                            {user.username}
                        </div>
                        <div className="text-sm text-muted">{user.email}</div>
                        <div className="text-sm">{user.phone_number}</div>

                        <span
                            className={`badge ${
                                user.status === "active"
                                    ? "badge-success"
                                    : "badge-warning"
                            } w-fit`}
                        >
                            {user.status}
                        </span>

                        {/* Buttons inline */}
                        <div className="flex gap-2 pt-2">
                            <a
                                href={route("branch.users.view", user.user_id)}
                                className="btn btn-outline px-3 py-1 text-xs flex items-center gap-1 flex-1"
                            >
                                <Icon name="eye" className="w-3 h-3" />
                                View
                            </a>
                            <button
                                onClick={() => toggleStatus(user)}
                                className="btn btn-danger px-3 py-1 text-xs flex-1"
                            >
                                {user.status === "active"
                                    ? "Deactivate"
                                    : "Activate"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= PAGINATION ================= */}
            {users.length > 0 && (
                <div className="flex justify-end gap-2 pt-4 flex-wrap">
                    <button
                        disabled={!meta?.prev_page_url}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="btn btn-outline"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                        Page {meta?.current_page || 1} of {meta?.last_page || 1}
                    </span>
                    <button
                        disabled={!meta?.next_page_url}
                        onClick={() => setPage((p) => p + 1)}
                        className="btn btn-outline"
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
}

AvailableUsers.layout = (page) => <AdminLayout>{page}</AdminLayout>;
