import React, { useState, useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function ApproveUsers({ users }) {
   
    const [search, setSearch] = useState("");

    const approveUser = (userId) => {
        if (!confirm("Approve this user?")) return;
        router.post(route("bank.users.approve", userId), {}, { preserveScroll: true });
    };

    const rejectUser = (userId) => {
        if (!confirm("Reject this user?")) return;
        router.post(route("bank.users.reject", userId), {}, { preserveScroll: true });
    };

    /**  filter users by name OR username */
    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            user.full_name.toLowerCase().includes(search.toLowerCase()) ||
            user.username?.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    return (
        <>
            <Head title="Approve Users" />

            <main className="page space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        User Approvals
                    </h1>
                    <p className="text-sm text-muted">
                        Review and approve users registered under your bank
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
                        placeholder="Search by name or username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                            w-full rounded-xl border border-[var(--color-border)]
                            bg-[var(--color-surface)] px-4 py-3 pl-10 text-sm
                            focus:outline-none focus:ring-2
                            focus:ring-[var(--color-primary)]
                        "
                    />
                </div>

                <div className="card overflow-x-auto hidden md:block">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[var(--color-primary-light)]">
                            <tr className="text-left">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Status</th>
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
                                            <span className="badge badge-warning">Pending</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => approveUser(user.user_id)}
                                                    className="btn btn-success btn-sm"
                                                >
                                                    <Icon name="check" className="w-4 h-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => rejectUser(user.user_id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <Icon name="x" className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-muted">
                                        No pending users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ================= MOBILE CARDS ================= */}
                <div className="space-y-4 md:hidden">
                    {filteredUsers.length ? (
                        filteredUsers.map((user) => (
                            <div key={user.user_id} className="card p-4 space-y-2">
                                <div className="font-semibold">{user.full_name}</div>
                                <div className="text-sm text-muted">{<Icon name="users" />}{user.email}</div>
                                <div className="text-sm">{<Icon name="phone" />}{user.phone_number}</div>
                                <div className="text-sm">{user.branch_name}</div>

                                <span className="badge badge-warning w-fit">Pending</span>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => approveUser(user.user_id)}
                                        className="btn btn-success btn-sm w-full"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => rejectUser(user.user_id)}
                                        className="btn btn-danger btn-sm w-full"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No pending users found</p>
                    )}
                </div>
            </main>
        </>
    );
}

ApproveUsers.layout = (page) => <AdminLayout>{page}</AdminLayout>;
