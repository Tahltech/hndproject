import React, { useState } from "react";
import { Head, router} from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function BankAdmins({ bankAdmins }) {
    const [search, setSearch] = useState("");

    // Filter admins based on name or username
    const filteredAdmins = bankAdmins.filter(
        (admin) =>
            admin.full_name.toLowerCase().includes(search.toLowerCase()) ||
            admin.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Bank Admins" />

            <main className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        Bank Admins
                    </h1>

                    <div className="relative w-64">
                        <Icon
                            name="search"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
                        />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                                w-full pl-10 pr-3 py-2.5
                                rounded-xl
                                border border-[var(--color-border)]
                                bg-[var(--color-surface)]
                                text-sm
                                focus:outline-none
                                focus:ring-2 focus:ring-[var(--color-primary-light)]
                                focus:border-[var(--color-primary)]
                            "
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAdmins.length === 0 ? (
                        <p className="text-[var(--color-text-muted)]">
                            No bank admins found.
                        </p>
                    ) : (
                        filteredAdmins.map((admin) => (
                            <div
                                key={admin.user_id}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-5 flex flex-col items-center space-y-3"
                            >
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--color-primary-light)] flex items-center justify-center">
                                    <img
                                        src={
                                            admin.profile_photo
                                                ? `/storage/profile_photos/${admin.profile_photo}`
                                                : "/storage/profile_photos/default-avatar.png"
                                        }
                                        alt={admin.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                    {admin.full_name}
                                </h3>
                                <p className="text-[var(--color-text-muted)] text-sm">
                                    @{admin.username}
                                </p>
                                <div className="text-sm space-y-1">
                                    <p>
                                        <span className="font-semibold">
                                            Email:
                                        </span>{" "}
                                        {admin.email || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Phone:
                                        </span>{" "}
                                        {admin.phone_number || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Bank Name:
                                        </span>{" "}
                                        {admin.bank?.name || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Status:
                                        </span>{" "}
                                        <span
                                            className={
                                                admin.status === "active"
                                                    ? "success"
                                                    : "danger"
                                            }
                                        >
                                            {admin.status || "inactive"}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    {/* Activate / Deactivate */}
                                    <button
                                        onClick={() =>
                                            router.patch(
                                                route(
                                                    "itadmin.bankadmin.status",
                                                    admin.user_id
                                                )
                                            )
                                        }
                                        className={`px-3 py-1 text-xs rounded-lg font-semibold ${
                                            admin.status === "active"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"
                                        }`}
                                    >
                                        {admin.status === "active"
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => {
                                            if (confirm("Are you sure?")) {
                                                router.delete(
                                                    route(
                                                        "itadmin.bankadmin.delete",
                                                        admin.user_id
                                                    )
                                                );
                                            }
                                        }}
                                        className="px-3 py-1 text-xs rounded-lg bg-red-600 text-white"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </>
    );
}

// Set the layout
BankAdmins.layout = (page) => <AdminLayout>{page}</AdminLayout>;
