import React, { useEffect, useState } from "react";
import { usePage, router, Head, Link } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import Layout from "../Layout/Layout";
import axios from "axios";
import Modal from "../../Components/Modal";
import BalanceForm from "../../Components/BalanceForm";

export default function Userdashboard() {
    const { errors, flash } = usePage().props;

    const [balance, setBalance] = useState(0);
    const [showBalance, setShowBalance] = useState(false);

    // Popup control
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("add"); // "add" | "withdraw"

    useEffect(() => {
        axios
            .get("/dashboard/account/ballance")
            .then((response) => {
                setBalance(response.data.ballance ?? 0);
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

            {/* SINGLE MODAL POPUP */}
            <Modal show={showPopup} onClose={() => setShowPopup(false)}>
                <BalanceForm type={popupType === "add" ? "credit" : "debit"} />
            </Modal>
        </main>
    );
}

Userdashboard.layout = (page) => <Layout>{page}</Layout>;
