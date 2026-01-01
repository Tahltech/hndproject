import { Link, Head } from "@inertiajs/react";
import { useState, useMemo } from "react";
import Icon from "../Components/Icons";
import PublicLayout from "./Layout/PublicLayout";

const ITEMS_PER_PAGE = 6;

function Branches({ branches,bank_id }) {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [page, setPage] = useState(0);

    const branchList = branches?.data ?? branches ?? [];

    // 🔹 Collect unique cities/regions
    const cities = useMemo(() => {
        return [...new Set(branchList.map((b) => b.city).filter(Boolean))];
    }, [branchList]);

    // Apply search + city filter
    const filteredBranches = useMemo(() => {
        return branchList.filter((branch) => {
            const matchesSearch = `${branch.name} ${branch.address}`
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCity = city ? branch.city === city : true;

            return matchesSearch && matchesCity;
        });
    }, [branchList, search, city]);

    // Pagination logic
    const start = page * ITEMS_PER_PAGE;
    const paginatedBranches = filteredBranches.slice(
        start,
        start + ITEMS_PER_PAGE
    );

    const hasNext = start + ITEMS_PER_PAGE < filteredBranches.length;
    const hasPrev = page > 0;

    return (
        <PublicLayout>
            <main className="p-4 space-y-5">
                <Head title="Branches" />

                <div>
                    <h2 className="text-2xl font-bold">
                        Available Branches Under This Bank
                    </h2>
                    <p className="italic text-gray-500 text-sm">
                        Click below to register under a branch
                    </p>
                </div>

                {/* 🔍 Search + City Filter */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">
                    {/* Search */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by name or address..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                            className="
                                w-full rounded-xl border border-[var(--color-border)]
                                bg-[var(--color-surface)]
                                px-4 py-3 pl-10 text-sm
                                focus:outline-none focus:ring-2
                                focus:ring-[var(--color-primary)]
                            "
                        />
                        <Icon
                            name="search"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                        />
                    </div>

                    {/* City Filter */}
                    <select
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                            setPage(0);
                        }}
                        className="
                            rounded-xl border border-[var(--color-border)]
                            bg-[var(--color-surface)]
                            px-4 py-3 text-sm
                            focus:outline-none focus:ring-2
                            focus:ring-[var(--color-primary)]
                        "
                    >
                        <option value="">All Cities / Regions</option>
                        {cities.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Branch Cards */}
                <div className="relative">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {paginatedBranches.length ? (
                            paginatedBranches.map((branch) => (
                                <Link
                                    key={branch.branch_id}
                                    href={route("branchsignup", {
                                        bank:bank_id,
                                        branch: branch.branch_id,
                                    })}
                                    className="
                                        group flex items-center justify-between
                                        rounded-2xl border border-[var(--color-border)]
                                        bg-[var(--color-surface)] p-5
                                        shadow-sm hover:shadow-md
                                        transition-all
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[var(--color-primary-light)]">
                                            <Icon
                                                name="bank"
                                                className="w-5 h-5 text-[var(--color-primary)]"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-[var(--color-text-primary)]">
                                                {branch.name}
                                            </p>
                                            <p className="text-sm text-muted">
                                                {branch.address} — {branch.city}
                                            </p>
                                        </div>
                                    </div>

                                    <Icon
                                        name="credit"
                                        className="w-5 h-5 text-[var(--color-primary)] group-hover:translate-x-1 transition"
                                    />
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-muted">
                                No branches found.
                            </p>
                        )}
                    </div>

                    {/* pagination Arrows */}
                    {hasNext && (
                        <button
                            onClick={() => setPage(page + 1)}
                            className="
                                absolute -right-4 top-1/2 -translate-y-1/2
                                bg-[var(--color-primary)]
                                text-white p-3 rounded-full shadow-lg
                                hover:scale-105 transition
                            "
                        >
                            <Icon name="chevron-right" className="w-5 h-5" />
                        </button>
                    )}

                    {hasPrev && (
                        <button
                            onClick={() => setPage(page - 1)}
                            aria-label="Previous banks"
                            className="absolute -left-10 top-1/2 -translate-y-1/2 w-14 h-14
                             flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-xl
                             hover:scale-110 hover:shadow-2xl transition-all duration-200"
                        >
                            <span className="text-3xl font-bold leading-none">
                                &lt;
                            </span>
                        </button>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}

export default Branches;
