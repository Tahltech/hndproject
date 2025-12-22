import PublicLayout from "./Layout/PublicLayout";
import { Link, Head } from "@inertiajs/react";
import React from "react";
import { route } from "ziggy-js";
import Toast from "../Components/Toast";
import AppLayout from "./Layout/AppLayout";
import Icon from "../Components/Icons";

export default function Home({ banks }) {
    return (
<main className="bg-[var(--color-background)]">
    <Head title="Home" />

    <Toast />

    {/*  HERO SECTION*/}
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Empowering Your{" "}
            <span className="text-[var(--color-primary)]">Financial</span>{" "}
            Journey
        </h1>

        <p className="mt-5 text-base md:text-lg text-[var(--color-text-muted)]">
            Secure, modern banking tools built to help you grow with confidence.
        </p>

        {/* Feature Icons */}
        <div className="mt-8 flex justify-center gap-6 text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
                <Icon name="wallet" className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="text-sm">Smart Wallets</span>
            </div>
            <div className="flex items-center gap-2">
                <Icon name="shield" className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="text-sm">Secure Banking</span>
            </div>
            <div className="flex items-center gap-2">
                <Icon name="users" className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="text-sm">Trusted Banks</span>
            </div>
        </div>

        {/* Actions */}
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

    {/*BANKS SECTION*/}
    <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
            Available Banks
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Select a bank below to open an account
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
            {(banks?.data ?? banks)?.map((bank) => (
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
            ))}
        </div>
    </section>
</main>


    );
}

Home.layout = (page) => <PublicLayout>{page}</PublicLayout>;
