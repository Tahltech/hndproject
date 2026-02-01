import React, { useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import AppLayout from "../Layout/AppLayout";
import Modal from "../../Components/Modal";
import { route } from "ziggy-js";

export default function LoanDashboard() {
    const [loanInfo, setLoanInfo] = useState({
        eligible: false,
        loanLimit: 0,
        activeLoanTotal: 0,
        remainingLimit: 0,
        activeLoans: [],
        message: "",
    });

    const { props } = usePage();
    const user = props?.auth?.user;
    const hasBank = !!user?.bank_id;

    const [showQuickLoanModal, setShowQuickLoanModal] = useState(false);
    const [quickLoanProcessing, setQuickLoanProcessing] = useState(false);
    const [quickLoanResult, setQuickLoanResult] = useState(null);
    const [quickLoanAmount, setQuickLoanAmount] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoanInfo();
    }, []);

    const fetchLoanInfo = () => {
        setLoading(true);
        axios
            .get("/mydashboard/loan-status")
            .then((res) => setLoanInfo(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleQuickLoan = async () => {
        if (!quickLoanAmount || parseFloat(quickLoanAmount) <= 0) {
            alert("Please enter a valid loan amount");
            return;
        }

        setQuickLoanProcessing(true);
        setQuickLoanResult(null);

        try {
            const res = await axios.post("/quick-loan/grant", {
                amount: quickLoanAmount,
            });
            setQuickLoanResult(res.data);

            if (res.data.success) {
                fetchLoanInfo(); // refresh dashboard
            }
        } catch (err) {
            setQuickLoanResult({
                success: false,
                message:
                    err.response?.data?.message ||
                    "Error processing quick loan",
            });
        } finally {
            setQuickLoanProcessing(false);
        }
    };

    return (
        <>
            <Head title="Loans" />

            <div className="flex-between mb-6">
                <h1 className="text-2xl font-semibold">Loan Dashboard</h1>

                <div className="flex gap-2">
                    <button
                        disabled={!hasBank}
                        onClick={() => setShowQuickLoanModal(true)}
                        className="btn btn-primary btn-sm"
                    >
                        Quick Loan
                    </button>

                    <Link
                        href={route("getloanapplication")}
                        className={`btn btn-sm ${
                            loanInfo.eligible
                                ? "btn-outline"
                                : "btn-outline opacity-60 pointer-events-none"
                        }`}
                    >
                        Full Loan Application
                    </Link>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-muted">Loading loan data...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div
                            className="card text-center border-l-4"
                            style={{
                                borderColor: loanInfo.eligible
                                    ? "var(--color-primary)" 
                                    : "var(--color-danger)", 
                            }}
                        >
                            <p className="text-sm text-muted">Eligibility</p>
                            <p
                                className="text-lg font-semibold"
                                style={{
                                    color: loanInfo.eligible
                                        ? "var(--color-primary)" 
                                        : "var(--color-danger)", 
                                }}
                            >
                                {loanInfo.eligible
                                    ? "Eligible"
                                    : "Not Eligible"}
                            </p>
                        </div>

                        <div className="card text-center border-l-4 border-[var(--color-primary)]">
                            <p className="text-sm text-muted">Loan Limit</p>
                            <p className="text-lg font-semibold brand-accent">
                                {loanInfo.loanLimit.toLocaleString()} XAF
                            </p>
                        </div>

                        <div className="card text-center border-l-4 border-[var(--color-danger)]">
                            <p className="text-sm text-muted">
                                Active Loans Total
                            </p>
                            <p className="text-lg font-semibold danger">
                                {loanInfo.activeLoanTotal.toLocaleString()} XAF
                            </p>
                        </div>

                        <div className="card text-center border-l-4 border-[var(--color-success)]">
                            <p className="text-sm text-muted">
                                Remaining Capacity
                            </p>
                            <p className="text-lg font-semibold success">
                                {loanInfo.remainingLimit.toLocaleString()} XAF
                            </p>
                        </div>
                    </div>

                    {loanInfo.message && (
                        <div
                            className={`alert ${loanInfo.eligible ? "alert-success" : "alert-error"}`}
                        >
                            {loanInfo.message}
                        </div>
                    )}

                    <section className="card mb-6">
                        <h2 className="text-lg font-semibold mb-3">
                            Active Loans
                        </h2>

                        {loanInfo.activeLoans.length > 0 ? (
                            <div className="space-y-3">
                                {loanInfo.activeLoans.map((loan, index) => (
                                    <div
                                        key={index}
                                        className="flex-between border-b pb-2 last:border-none"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {loan.amount.toLocaleString()}{" "}
                                                XAF
                                            </p>
                                            <p className="text-sm text-muted">
                                                Status:{" "}
                                                <span className="badge badge-success">
                                                    {loan.status}
                                                </span>
                                            </p>
                                        </div>
                                        <span className="text-sm text-muted">
                                            {loan.duration} months
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted text-center py-4">
                                You have no active loans
                            </p>
                        )}
                    </section>

                    {/* Quick Loan Modal */}
                    <Modal
                        show={showQuickLoanModal}
                        onClose={() => {
                            setShowQuickLoanModal(false);
                            setQuickLoanResult(null);
                            setQuickLoanAmount("");
                        }}
                    >
                        <div className="p-6 max-w-md text-center">
                            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                                Quick Loan Request
                            </h3>

                            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                Enter the amount you wish to request. The
                                backend will immediately check your eligibility
                                and grant the loan if you qualify.
                            </p>

                            <input
                                type="number"
                                placeholder="Enter loan amount"
                                value={quickLoanAmount}
                                onChange={(e) =>
                                    setQuickLoanAmount(e.target.value)
                                }
                                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 mb-4 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            />

                            <button
                                onClick={handleQuickLoan}
                                disabled={quickLoanProcessing}
                                className="w-full btn btn-primary text-white font-bold py-2 rounded-lg"
                            >
                                {quickLoanProcessing
                                    ? "Processing..."
                                    : "Request Quick Loan"}
                            </button>

                            {quickLoanResult && (
                                <div
                                    className={`mt-4 p-3 rounded-lg text-center ${
                                        quickLoanResult.success
                                            ? "bg-success/20 text-success"
                                            : "bg-danger/20 text-danger"
                                    }`}
                                >
                                    {quickLoanResult.message}
                                </div>
                            )}
                        </div>
                    </Modal>
                </>
            )}
        </>
    );
}

LoanDashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
