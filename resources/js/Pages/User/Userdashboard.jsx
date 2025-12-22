import React, { useEffect, useState } from "react";
import { usePage, router, Head, Link } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
//import Layout from "../Layout/Layout";
import axios from "axios";
import Modal from "../../Components/Modal";
import BalanceForm from "../../Components/BalanceForm";

export default function Userdashboard() {
    const { errors, flash } = usePage().props;

    const [balance, setBalance] = useState(0);
    const [showBalance, setShowBalance] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [latestTransaction, setLatestTransaction] = useState([]);

    // Popup control
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("add");

    useEffect(() => {
        axios
            .get("/dashboard/account/ballance")
            .then((response) => {
                setBalance(response.data.ballance ?? 0);
                setTransactions(response.data.transactions ?? []);
                setLatestTransaction(response.data.latestTransaction ?? []);
            })
            .catch((err) => console.error(err));
    }, []);

    const logout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <main className="p-6">
            <Head title="Dashboard" />
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto mt-10">
                <h2 className="text-xl font-semibold mb-6">Main Balance</h2>

                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                        XAF {showBalance ? balance : "*****"}
                    </span>

                    <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-gray-600 hover:text-black"
                    >
                        {showBalance ? <EyeOff /> : <Eye />}
                    </button>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex mt-6 gap-4">
                    {/* ADD BALANCE */}
                    <button
                        onClick={() => {
                            setPopupType("add");
                            setShowPopup(true);
                        }}
                        className="flex-1 bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-all duration-200"
                    >
                        Add Savings
                    </button>

                    {/* WITHDRAW BALANCE */}
                    <button
                        onClick={() => {
                            setPopupType("withdraw");
                            setShowPopup(true);
                        }}
                        className="flex-1 bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-red-700 transition-all duration-200"
                    >
                        Withdraw Savings
                    </button>
                </div>
            </div>
            {/* LOGOUT + LOAN BUTTONS */}
            <div className="flex items-center gap-6 mt-6">
                <form onSubmit={logout}>
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Logout
                    </button>
                </form>

                <Link
                    href={route("loan.index")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Loan
                </Link>
            </div>
            <Modal show={showPopup} onClose={() => setShowPopup(false)}>
                <BalanceForm type={popupType === "add" ? "credit" : "debit"} />
            </Modal>
            {/* //transaction section */}
            <section className="bg-white rounded-2xl shadow-lg p-6 mt-8  mx-auto">
                {/* Section heading */}
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Transactions
                </h3>

                {/* Transaction list */}
                <div className="divide-y divide-gray-200">
                    {transactions?.length > 0 ? (
                        transactions.map((transaction) => {
                            const isDeposit =
                                transaction.type.toLowerCase() === "deposit";
                            const colorClass = isDeposit
                                ? "text-blue-600"
                                : "text-red-600";
                            const sign = isDeposit ? "+" : "-";

                            return (
                                <div
                                    key={transaction.transaction_id}
                                    className="flex justify-between items-center py-2"
                                >
                                    {/* Type label */}
                                    <span className="font-bold text-gray-700">
                                        {transaction.type
                                            .charAt(0)
                                            .toUpperCase() +
                                            transaction.type.slice(1)}
                                    </span>

                                    <span className="font-bold text-gray-700">
                                        {transaction.method === "mtn_momo"
                                            ? "MTN MOMO"
                                            : "Orange Money"}
                                    </span>
                                    {/* Amount with sign and color */}
                                    <span className={`font-bold ${colorClass}`}>
                                        {sign}
                                        {transaction.amount.toLocaleString()}{" "}
                                        XAF
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-center py-4">
                            No transactions yet
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}

//Userdashboard.layout = (page) => <Layout>{page}</Layout>;
