import React, { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import axios from "axios";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function Admindashboard() {
    const [branches, setBranches] = useState([]);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/bnkadmindashboard/branches")
            .then((response) => {
                setBranches(response.data.branches || []);
                setUser(response.data.authUser || null);
            })
            .catch((error) => console.error("Error fetching data:", error))
            .finally(() => setLoading(false));
    }, []);

    const filteredBranches = branches.filter((branch) =>
        branch.name.toLowerCase().includes(search.toLowerCase())
    );

    const logout = (e) => {
        e.preventDefault();
        axios.post("/logout").then(() => {
            window.location.href = "/";
        });
    };

    return (
        <>
            <Head title="Bank Admin Dashboard" />

            <main className="page space-y-8">
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
                                            ? `/storage/bank_logos/${user?.bank?.profile_photo}`
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

                {/* Stats / Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Total Branches */}
                    <div className="card">
                        <p className="text-muted">Total Branches</p>
                        <h3 className="mt-2 font-extrabold text-[1.8rem]">
                            {branches.length}
                        </h3>
                    </div>

                    {/* Create Branch */}
                    <Link
                        href={route("createbranch")}
                        className="btn btn-primary flex justify-between items-center"
                    >
                        <div>
                            <p className="text-sm opacity-90">Add New Branch</p>
                            <h3 className="mt-1 font-bold text-lg">
                                Create Branch
                            </h3>
                        </div>
                        <Icon name="bank" className="w-6 h-6" />
                    </Link>
                </div>

                {/* Branches List */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-[var(--color-border)]">
                        <h2 className="font-semibold">Available Branches</h2>
                        <p className="text-sm text-muted">
                            Select a branch to manage administrators
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-6 text-muted">
                            Loading branches...
                        </div>
                    ) : filteredBranches.length === 0 ? (
                        <div className="p-6 text-muted">No branches found.</div>
                    ) : (
                        <ul className="divide-y divide-[var(--color-border)]">
                            {filteredBranches.map((branch) => (
                                <li key={branch.branch_id}>
                                    <Link
                                        href={route("createbranchadmin", {
                                            branch: branch.branch_id,
                                        })}
                                        className="flex items-center justify-between px-6 py-4 hover:bg-[var(--color-primary-light)] transition"
                                    >
                                        <span className="font-medium">
                                            {branch.name}
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
                </div>
            </main>
        </>
    );
}

Admindashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
