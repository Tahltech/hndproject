import React, { useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";
import axios from "axios";
import Modal from "../../Components/Modal";
import BalanceForm from "../../Components/BalanceForm";
import Icon from "../../Components/Icons";

export default function Userdashboard() {
    const { props } = usePage();
    const user = props.auth?.user;
    const [balance, setBalance] = useState(0);
    const [showBalance, setShowBalance] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("add");

    const hasBank = !!user?.bank && user?.status === "active";

    useEffect(() => {
        axios
            .get("/mydashboard/account/ballance")
            .then((response) => {
                setBalance(response.data.ballance ?? 0);
                setTransactions(response.data.transactions ?? []);
            })
            .catch(console.error);
    }, []);

    const lastFiveTransactions = transactions.slice(0, 5);

    return (
        <>
            <Head title="Dashboard" />

            <main className="page space-y-8 w-full">
                {/* HEADER */}
                <div>
                    {/* ================== DASHBOARD HEADER ================== */}
                    <div className="flex items-center justify-between mb-8">
                        {/* Profile + Welcome */}
                        <div className="flex items-center gap-4">
                            {/* Profile photo */}
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--color-primary-light)] flex items-center justify-center group hover:ring-2 hover:ring-[var(--color-primary)] transition">
                                <img
                                    src={
                                        user?.profile_photo
                                            ? `/storage/profile_photos/${user.profile_photo}`
                                            : "/storage/profile_photos/default-avatar.png"
                                    }
                                    alt={user?.name || "User Avatar"}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Welcome message */}
                            <div className="flex flex-col">
                                <p className="text-sm text-gray-500">
                                    Welcome back,
                                </p>
                                <h1 className="text-2xl font-semibold text-gray-800">
                                    {user?.name || "User"}
                                </h1>
                            </div>
                        </div>

                        {/* Optional: Quick action button */}
                        <Link
                            href={route("userloanservices")}
                            className="btn btn-sm btn-primary flex items-center gap-2 px-3 h-10"
                        >
                            <Icon name="loan" className="w-4 h-4" />
                            <span className="text-xs font-semibold">
                                Loan Services
                            </span>
                        </Link>
                    </div>

                    <p className="text-muted">Overview of your account</p>
                </div>

                {/* BALANCE CARD */}
                <div className="card max-w-md mx-auto text-center border-[var(--color-primary)]">
                    <p className="text-sm text-muted">Main Balance</p>

                    <div className="flex justify-center items-center gap-3 mt-3">
                        <span className="text-3xl font-bold">
                            XAF{" "}
                            {showBalance ? balance.toLocaleString() : "*****"}
                        </span>

                        <button
                            type="button"
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-muted hover:opacity-80 transition"
                            aria-label="Toggle balance visibility"
                        >
                            {showBalance ? (
                                <Icon name="eyeoff" className="w-5 h-5" />
                            ) : (
                                <Icon name="eye" className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <button
                            disabled={!hasBank}
                            onClick={() => {
                                setPopupType("add");
                                setShowPopup(true);
                            }}
                            className="btn btn-success flex items-center justify-center gap-2"
                        >
                            <Icon name="credit" className="w-5 h-5" />
                            Add Savings
                        </button>

                        <button
                            disabled={!hasBank}
                            onClick={() => {
                                setPopupType("withdraw");
                                setShowPopup(true);
                            }}
                            className="btn btn-danger flex items-center justify-center gap-2"
                        >
                            <Icon name="debit" className="w-5 h-5" />
                            Withdraw
                        </button>
                    </div>
                </div>

                <section className="card">
                    <div className="flex-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Icon
                                name="transaction"
                                className="w-5 h-5 text-muted"
                            />
                            Recent Transactions
                        </h3>

                        <Link
                            // href={route("user.transactions")}
                            className="text-sm brand-accent"
                        >
                            View all
                        </Link>
                    </div>

                    {lastFiveTransactions.length > 0 ? (
                        <div className="divide-y">
                            {lastFiveTransactions.map((tx) => {
                                const isDeposit =
                                    tx.type.toLowerCase() === "deposit";

                                return (
                                    <div
                                        key={tx.transaction_id}
                                        className="flex justify-between items-center py-3 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon
                                                name={
                                                    isDeposit
                                                        ? "credit"
                                                        : "debit"
                                                }
                                                className={`w-5 h-5 ${
                                                    isDeposit
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }`}
                                            />

                                            <div>
                                                <p className="font-medium capitalize">
                                                    {tx.type}
                                                </p>
                                                <p className="text-muted text-xs">
                                                    {tx.method === "mtn_momo"
                                                        ? "MTN MOMO"
                                                        :tx.method === 'orange'? "Orange Money": "Cash"}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`font-semibold ${
                                                isDeposit ? "success" : "text-red-500"
                                            }`}
                                        >
                                            {isDeposit ? "+" : "-"}
                                            {tx.amount.toLocaleString()} XAF
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted text-center py-6">
                            No transactions yet
                        </p>
                    )}
                </section>

                <Modal show={showPopup} onClose={() => setShowPopup(false)}>
                    <BalanceForm
                        type={popupType === "add" ? "credit" : "debit"}
                    />
                </Modal>
            </main>
        </>
    );
}

Userdashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
