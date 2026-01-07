import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import AppLayout from "../Layout/AppLayout";

export default function LoanRepayments() {
    const [repayments, setRepayments] = useState([]);
    const [activeLoans, setActiveLoans] = useState([]);
    const [repayAmounts, setRepayAmounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState({}); // track per loan

    useEffect(() => {
        fetchRepayments();
    }, []);

    const fetchRepayments = () => {
        setLoading(true);
        axios
            .get("/mydashboard/loan-repayments")
            .then((res) => {
                setRepayments(res.data.repayments || []);
                setActiveLoans(res.data.activeLoans || []);
                // Initialize repayAmounts
                const initial = {};
                (res.data.activeLoans || []).forEach(
                    (loan) => (initial[loan.loan_id] = "")
                );
                setRepayAmounts(initial);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleRepay = (e, loan_id) => {
        e.preventDefault();
        const amount = repayAmounts[loan_id];
        if (!amount || parseFloat(amount) <= 0) return;

        setProcessing((prev) => ({ ...prev, [loan_id]: true }));

        axios
            .post("/mydashboard/loan-repay", { loan_id, amount })
            .then((res) => {
                setRepayments(res.data.repayments);
                setActiveLoans(res.data.activeLoans);
                setRepayAmounts((prev) => ({ ...prev, [loan_id]: "" }));
            })
            .catch((err) => {
                console.error(err);
                alert(err.response?.data?.message || "Error making repayment");
            })
            .finally(() =>
                setProcessing((prev) => ({ ...prev, [loan_id]: false }))
            );
    };

    // Compute totals
    const totalRepayable = activeLoans.reduce(
        (sum, loan) => sum + (loan.total_with_interest || 0),
        0
    );
    const totalPaid = activeLoans.reduce(
        (sum, loan) => sum + (loan.paid || 0),
        0
    );
    const totalRemaining = totalRepayable - totalPaid;

    return (
        <>
            <Head title="Loan Repayments" />

            <h1 className="text-2xl font-semibold mb-4">Loan Repayments</h1>
            {/* ================= REPAYMENT FORM ================= */}
            {activeLoans.length ? (
                <div className="card mb-6 max-w-md mx-auto p-6">
                    <h2 className="text-lg font-semibold mb-3">Repay Loan</h2>

                    {/* Compute total remaining */}
                    <p className="text-sm text-muted mb-4">
                        Total Remaining:{" "}
                        {activeLoans
                            .reduce((sum, loan) => sum + loan.remaining, 0)
                            .toLocaleString()}{" "}
                        XAF
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRepayTotal();
                        }}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="number"
                            min="1"
                            max={activeLoans.reduce(
                                (sum, loan) => sum + loan.remaining,
                                0
                            )}
                            value={repayAmounts.total || ""}
                            onChange={(e) =>
                                setRepayAmounts({ total: e.target.value })
                            }
                            className="input"
                            placeholder="Enter amount to repay"
                            required
                        />
                        <button
                            type="submit"
                            disabled={processing.total || !repayAmounts.total}
                            className="btn btn-success w-full"
                        >
                            {processing.total ? "Processing..." : "Repay Loan"}
                        </button>
                    </form>
                </div>
            ) : (
                <p className="text-center text-muted mb-6">
                    You have no active loans to repay.
                </p>
            )}
            {/* ================= TOTALS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card text-center">
                    <p className="text-sm text-muted">Total Repayable</p>
                    <p className="text-lg font-semibold">
                        {totalRepayable.toLocaleString()} XAF
                    </p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-muted">Total Paid</p>
                    <p className="text-lg font-semibold success">
                        {totalPaid.toLocaleString()} XAF
                    </p>
                </div>
                <div className="card text-center">
                    <p className="text-sm text-muted">Remaining</p>
                    <p className="text-lg font-semibold danger">
                        {totalRemaining.toLocaleString()} XAF
                    </p>
                </div>
            </div>

            {/* ================= REPAYMENT HISTORY ================= */}
            <div className="card overflow-x-auto">
                {loading ? (
                    <p className="text-center text-muted py-6">Loading...</p>
                ) : repayments.length ? (
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Remaining</th>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repayments.map((r) => (
                                <tr key={r.repayment_id}>
                                    <td>
                                        {new Date(r.date).toLocaleDateString()}
                                    </td>
                                    <td>{r.amount.toLocaleString()} XAF</td>
                                    <td>{r.amount_due.toLocaleString()} XAF</td>
                                    <td>{r.repayment_method || "Balance"}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                r.status === "paid"
                                                    ? "badge-success"
                                                    : r.status === "overdue"
                                                    ? "badge-danger"
                                                    : "badge-warning"
                                            }`}
                                        >
                                            {r.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-muted py-6">
                        No repayments yet
                    </p>
                )}
            </div>
        </>
    );
}

LoanRepayments.layout = (page) => <AppLayout>{page}</AppLayout>;
