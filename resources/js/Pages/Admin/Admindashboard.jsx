import React, { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import axios from "axios";
import AppLayout from "../Layout/AppLayout";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function Admindashboard() {
    const [banks, setBanks] = useState([]);
    const [search, setSearch] = useState("");
    const [user, setUSer] = useState(null);

    useEffect(() => {
        axios
            .get("/Itadmindashboard/admin/banks")
            .then((response) => {
                setBanks(response.data.banks || []);
                setUSer(response.data.authUser || null);
            })
            .catch((error) => {
                console.error("Error fetching banks:", error);
            });
    }, []);

    /**  Filter banks as user types */
    const filteredBanks = banks.filter((bank) =>
        bank.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Admin Dashboard" />

            <main className="space-y-8">
                {/* ===== Top Right Bar ===== */}
                <div className="flex justify-end">
                    <div className="flex items-center gap-6">
                        {/* Search */}
                        <div className="relative w-64">
                            <Icon
                                name="search"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search banks..."
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

                        {/* Profile */}
                        <div className="flex flex-col items-center cursor-pointer group">
                            <div
                                className="
                              w-12 h-12 rounded-full
                                 overflow-hidden
                                     bg-[var(--color-primary-light)]
                             flex items-center justify-center
                              group-hover:ring-2 group-hover:ring-[var(--color-primary)]
                            transition
                           "
                            >
                                <img
                                    src={
                                        user?.profile_photo
                                            ? `/storage/profile_photos/${user.profile_photo}`
                                            : "/storage/profile_photos/default-avatar.png"
                                    }
                                    alt={user?.full_name || "User"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs font-semibold mt-1">
                                {user?.username || "username"}
                            </p>
                        </div>
                    </div>
                </div>

                {/*Stats / Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Total Banks
                        </p>
                        <h3 className="text-3xl font-extrabold mt-1">
                            {banks.length}
                        </h3>
                    </div>

                    <Link
                        href={route("itadmin.createbank")}
                        className="
                            bg-[var(--color-primary)]
                            text-white
                            rounded-2xl
                            p-5
                            shadow
                            flex items-center justify-between
                            hover:opacity-90
                            transition
                        "
                    >
                        <div>
                            <p className="text-sm opacity-90">Add New Bank</p>
                            <h3 className="text-xl font-bold mt-1">
                                Create Bank
                            </h3>
                        </div>
                        <Icon name="bank" className="w-6 h-6" />
                    </Link>
                </div>

                {/* Banks List */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm">
                    <div className="px-6 py-4 border-b border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold">
                            Available Banks
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Select a bank to manage administrators
                        </p>
                    </div>

                    {filteredBanks.length === 0 ? (
                        <div className="p-6 text-sm text-[var(--color-text-muted)]">
                            No banks found.
                        </div>
                    ) : (
                        <ul className="divide-y divide-[var(--color-border)]">
                            {filteredBanks.map((bank) => (
                                <li key={bank.bank_id}>
                                    <Link
                                        href={route(
                                            "itadmin.create.admin",
                                            bank.bank_id
                                        )}
                                        className="
                                            flex items-center justify-between
                                            px-6 py-4
                                            hover:bg-[var(--color-primary-light)]
                                            transition
                                        "
                                    >
                                        <span className="font-medium">
                                            {bank.name}
                                        </span>
                                        <Icon
                                            name="bank"
                                            className="w-4 h-4 text-[var(--color-text-muted)]"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </>
    );
}

Admindashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
