import React, { useState, useEffect } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import axios from "axios";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function Admindashboard() {
    const [banks, setBanks] = useState([]);
    const [meta, setMeta] = useState({});
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const { props } = usePage();
    const user = props.auth?.user;

    useEffect(() => {
        axios
            .get("/Itadmindashboard/admin/banks", {
                params: { page, search },
            })
            .then((response) => {
                setBanks(response.data.banks?.data || []);
                setMeta(response.data.banks?.meta || {});
            })
            .catch((error) => {
                console.error("Error fetching banks:", error);
            });
    }, [page, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <>
            <Head title="Admin Dashboard" />

            <main className="space-y-8 page">
                <div className="flex items-center justify-between flex-nowrap w-full gap-4">
 
                    <div className="relative w-64">
                        <Icon
                            name="search"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search banks..."
                            className="input pl-10"
                        />
                    </div>

                    <div className="flex flex-col items-center cursor-pointer group">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-primary-light)] flex items-center justify-center group-hover:ring-2 group-hover:ring-[var(--color-primary)] transition">
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

                {/* ===== Stats / Actions ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="card  border-l-4 border-[var(--color-success)]">
                        <p className="text-sm text-muted">Total Banks</p>
                        <h3 className="text-3xl font-extrabold mt-1">
                            {meta?.total || 0}
                        </h3>
                    </div>

                    <Link
                        href={route("itadmin.createbank")}
                        className="btn btn-primary flex items-center justify-between"
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

                {/* ===== Banks List ===== */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold">
                            Available Banks
                        </h2>
                        <p className="text-sm text-muted">
                            Select a bank to manage administrators
                        </p>
                    </div>

                    {banks.length === 0 ? (
                        <div className="p-6 text-sm text-muted">
                            No banks found.
                        </div>
                    ) : (
                        <ul className="divide-y divide-[var(--color-border)]">
                            {banks.map((bank) => (
                                <li key={bank.bank_id}>
                                    <Link
                                        href={route(
                                            "itadmin.create.admin",
                                            bank.bank_id,
                                        )}
                                        className="flex items-center justify-between px-6 py-4 hover:bg-[var(--color-primary-light)] transition"
                                    >
                                        <span className="font-medium">
                                            {bank.name}
                                        </span>
                                        <Icon
                                            name="bank"
                                            className="w-4 h-4 text-muted"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* ===== Pagination: Next / Previous ===== */}
                    {meta?.last_page > 1 && (
                        <div className="flex justify-center gap-2 py-4">
                            <button
                                className="btn btn-outline"
                                onClick={() =>
                                    setPage((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={meta?.current_page === 1}
                            >
                                Previous
                            </button>

                            <span className="px-3 py-1 rounded border bg-[var(--color-surface)]">
                                Page {meta?.current_page || 1} of{" "}
                                {meta?.last_page || 1}
                            </span>

                            <button
                                className="btn btn-outline"
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.min(prev + 1, meta?.last_page),
                                    )
                                }
                                disabled={
                                    meta?.current_page === meta?.last_page
                                }
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

Admindashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
