import React, { useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import AppLayout from "../Layout/AppLayout";
import Icon from "../../Components/Icons";
import { route } from "ziggy-js";

export default function UserTransactions() {
    const { props } = usePage();
    const user = props.auth?.user;

    const [transactions, setTransactions] = useState([]);
    const [totalIn, setTotalIn] = useState(0);
    const [totalOut, setTotalOut] = useState(0);

    useEffect(() => {
        axios
            .get("/mydashboard/account/ballance")
            .then((response) => {
                const txs = response.data.transactions ?? [];
                setTransactions(txs);

                let inSum = 0;
                let outSum = 0;
                txs.forEach((tx) => {
                    const amount = Number(tx.amount) || 0;
                    if (tx.type.toLowerCase() === "deposit") {
                        inSum += amount;
                    } else {
                        outSum += amount;
                    }
                });

                setTotalIn(Math.floor(inSum));
                setTotalOut(Math.floor(outSum));
            })
            .catch(console.error);
    }, []);

    return (
        <>
            <Head title="Transactions" />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Transactions
                </h1>
                <Link
                    href={route("userdashboard")}
                    className="btn btn-sm btn-outline flex items-center gap-2"
                >
                    Back to Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-md text-center">
                    <p className="text-sm text-gray-500">Total Money In</p>
                    <p className="text-xl font-semibold text-[var(--color-success)]">
                        {totalIn.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                        })}{" "}
                        XAF
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-md text-center">
                    <p className="text-sm text-gray-500">Total Money Out</p>
                    <p className="text-xl font-semibold text-[var(--color-danger)]">
                        {totalOut.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                        })}{" "}
                        XAF
                    </p>
                </div>
            </div>

            <section className="card bg-[var(--color-surface)] p-4 rounded-2xl shadow-md">
                {transactions.length > 0 ? (
                    <div className="divide-y">
                        {transactions.map((tx) => {
                            const isDeposit =
                                tx.type.toLowerCase() === "deposit";
                            const amount = Math.floor(Number(tx.amount) || 0); // force integer

                            return (
                                <div
                                    key={tx.transaction_id}
                                    className="flex justify-between items-center py-3 text-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            name={
                                                isDeposit ? "credit" : "debit"
                                            }
                                            className={`w-5 h-5 ${
                                                isDeposit
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        />

                                        <div>
                                            <p className="font-bold capitalize">
                                                {tx.type}
                                            </p>
                                            <p className="text-muted text-xs">
                                                {tx.method === "mtn_momo"
                                                    ? "MTN MOMO"
                                                    : "Orange Money"}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`font-semibold ${
                                            isDeposit
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {isDeposit ? "+" : "-"}
                                        {amount.toLocaleString("en-US", {
                                            maximumFractionDigits: 0,
                                        })}{" "}
                                        XAF
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-6">
                        No transactions yet
                    </p>
                )}
            </section>
        </>
    );
}

UserTransactions.layout = (page) => <AppLayout>{page}</AppLayout>;
