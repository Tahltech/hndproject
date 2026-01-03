import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function ApproveUsers({ users }) {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const approveUser = (userId) => {
        if (!confirm("Approve this user?")) return;
        router.post(route("bank.users.approve", userId), {}, { preserveScroll: true });
        setSelectedUser(null);
    };

    const rejectUser = (userId) => {
        if (!confirm("Reject this user?")) return;
        router.post(route("bank.users.reject", userId), {}, { preserveScroll: true });
        setSelectedUser(null);
    };

    /* 🔍 Search */
    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            user.full_name.toLowerCase().includes(search.toLowerCase()) ||
            user.username?.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    return (
        <>
            <Head title="User Approvals" />

            <main className="page space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        User Approvals
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Review and approve users registered under your bank
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Icon
                        name="search"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
                    />
                    <input
                        type="text"
                        placeholder="Search by name or username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                            w-full rounded-xl border border-[var(--color-border)]
                            bg-[var(--color-surface)]
                            px-4 py-3 pl-10 text-sm
                            focus:outline-none focus:ring-2
                            focus:ring-[var(--color-primary)]
                        "
                    />
                </div>

                {/* ================= DESKTOP TABLE ================= */}
                <div className="card overflow-x-auto hidden md:block">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[var(--color-primary-light)]">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.user_id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{user.full_name}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">{user.phone_number}</td>
                                        <td className="px-4 py-3">
                                            <span className="badge badge-warning">
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="
                                                    inline-flex items-center gap-2
                                                    px-4 py-2 rounded-lg text-sm font-medium
                                                    bg-[var(--color-primary-light)]
                                                    text-[var(--color-primary)]
                                                    hover:opacity-80 transition
                                                "
                                            >
                                                <Icon name="eye" className="w-4 h-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-6 text-center text-muted">
                                        No pending users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ================= MOBILE CARDS ================= */}
                <div className="space-y-4 md:hidden">
                    {filteredUsers.map((user) => (
                        <div key={user.user_id} className="card p-4 space-y-2">
                            <div className="font-semibold">{user.full_name}</div>
                            <div className="text-sm text-muted flex gap-2">
                                <Icon name="mail" className="w-4 h-4" />
                                {user.email}
                            </div>
                            <div className="text-sm flex gap-2">
                                <Icon name="phone" className="w-4 h-4" />
                                {user.phone_number}
                            </div>

                            <span className="badge badge-warning w-fit">
                                {user.status}
                            </span>

                            <button
                                onClick={() => setSelectedUser(user)}
                                className="
                                    w-full mt-2 rounded-lg py-2
                                    bg-[var(--color-primary-light)]
                                    text-[var(--color-primary)]
                                    font-medium
                                "
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* ================= VIEW USER MODAL ================= */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] rounded-2xl w-full max-w-md p-6 space-y-4">
                        <h2 className="text-lg font-bold">
                            User Details
                        </h2>

                        <div className="text-sm space-y-2">
                            <p><strong>Name:</strong> {selectedUser.full_name}</p>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone_number}</p>
                            <p><strong>Status:</strong> {selectedUser.status}</p>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                onClick={() => approveUser(selectedUser.user_id)}
                                className="btn bg-[var(--color-success)]  w-full"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => rejectUser(selectedUser.user_id)}
                                className="btn bg-[var(--color-warning)]  w-full"
                            >
                                Reject
                            </button>
                        </div>

                        <button
                            onClick={() => setSelectedUser(null)}
                            className="w-full text-sm text-muted mt-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

ApproveUsers.layout = (page) => <AdminLayout>{page}</AdminLayout>;
