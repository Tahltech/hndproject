import PublicLayout from "./Layout/PublicLayout";
import { Link, Head } from "@inertiajs/react";
import React, { useState, useMemo } from "react";
import { route } from "ziggy-js";
import Icon from "../Components/Icons";

const ITEMS_PER_PAGE = 6;

export default function Home({ banks }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    const bankList = banks?.data ?? banks ?? [];

    const filteredBanks = useMemo(() => {
        return bankList.filter((bank) =>
            bank.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [bankList, search]);

    const start = page * ITEMS_PER_PAGE;
    const paginatedBanks = filteredBanks.slice(start, start + ITEMS_PER_PAGE);

    const hasNext = start + ITEMS_PER_PAGE < filteredBanks.length;
    const hasPrev = page > 0;

    return (
        <main className="bg-[var(--color-background)]">
            <Head title="Home" />

            <section className="max-w-4xl mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                    Empowering Your{" "}
                    <span className="text-[var(--color-primary)]">
                        Financial
                    </span>{" "}
                    Journey
                </h1>

                <p className="mt-5 text-base md:text-lg text-[var(--color-text-muted)]">
                    Secure, modern banking tools built to help you grow with
                    confidence.
                </p>

                {/* Feature Icons */}
                <div className="mt-8 flex justify-center gap-6 text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-2">
                        <Icon
                            name="wallet"
                            className="w-5 h-5 text-[var(--color-primary)]"
                        />
                        <span className="text-sm">Smart Wallets</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon
                            name="shield"
                            className="w-5 h-5 text-[var(--color-primary)]"
                        />
                        <span className="text-sm">Secure Banking</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon
                            name="users"
                            className="w-5 h-5 text-[var(--color-primary)]"
                        />
                        <span className="text-sm">Trusted Banks</span>
                    </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={route("login")}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold text-white shadow hover:opacity-90 transition"
                    >
                        <Icon name="login" className="w-4 h-4" />
                        Login
                    </Link>

                    <Link
                        href={route("signup")}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-gray-50 transition"
                    >
                        <Icon name="users" className="w-4 h-4" />
                        Create Account
                    </Link>
                </div>
            </section>

            {/* BANKS SECTION */}
            <section className="max-w-4xl mx-auto px-6 pb-20 space-y-5">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        Available Banks
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Select a bank below to open an account
                    </p>
                </div>

                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search banks..."
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

                <div className="relative">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {paginatedBanks.length ? (
                            paginatedBanks.map((bank) => (
                                <Link
                                    key={bank.bank_id}
                                    href={route("branches", bank.bank_id)}
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
                                        <span className="font-semibold text-[var(--color-text-primary)]">
                                            {bank.name}
                                        </span>
                                    </div>

                                    <Icon
                                        name="credit"
                                        className="w-5 h-5 text-[var(--color-primary)] group-hover:translate-x-1 transition"
                                    />
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-muted">
                                No banks found.
                            </p>
                        )}
                    </div>

                    {/* Pagination Arrows */}
                    {hasNext && (
                        <button
                            onClick={() => setPage(page + 1)}
                            aria-label="Next banks"
                            className="absolute -right-10 top-1/2 -translate-y-1/2 w-14 h-14
                            flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-200"
                        >
                            <span className="text-3xl font-bold leading-none">
                                &gt;
                            </span>
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
            </section>
        </main>
    );
}

Home.layout = (page) => <PublicLayout>{page}</PublicLayout>;
