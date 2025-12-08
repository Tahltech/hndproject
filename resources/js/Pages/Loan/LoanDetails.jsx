import React from "react";
import { route } from "ziggy-js";
import { useForm } from "@inertiajs/react";
import AlertMessage from "../../Components/AlertMessage";
import Layout from "../Layout/Layout";

export default function LoanDetails({ loan }) {
    const { data, setData, put, post } = useForm({
        status: "",
    });

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-6">Loan Details</h1>
            <AlertMessage />

            {/* Loan Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <strong>Loan ID:</strong> {loan.loan_id}
                </div>
                <div>
                    <strong>Account ID:</strong> {loan.account_id}
                </div>
                <div>
                    <strong>Amount:</strong> FCFA {loan.principal_amount}
                </div>
                <div>
                    <strong>Interest Rate:</strong> {loan.interest_rate}%
                </div>
                <div>
                    <strong>Repayment Period:</strong> {loan.repayment_period}{" "}
                    months
                </div>
                <div>
                    <strong>Status:</strong> {loan.status}
                </div>
                <div>
                    <strong>Purpose:</strong> {loan.loan_purpose}
                </div>
                <div>
                    <strong>Demanded:</strong>{" "}
                    {new Date(loan.created_at).toLocaleString()}
                </div>
            </div>

            {/* Borrower Info */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    Borrower Information
                </h2>
                {loan.account && loan.account.user ? (
                    <>
                        <p>
                            <strong>Name:</strong> {loan.account.user.full_name}
                        </p>
                        <p>
                            <strong>Email:</strong> {loan.account.user.email}
                        </p>
                    </>
                ) : (
                    <p>User info not available</p>
                )}
                <p>
                    <strong>ID Number:</strong> {loan.id_number}
                </p>
                <p>
                    <strong>Address:</strong> {loan.address}
                </p>
            </div>

            {/* Guarantor Info */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    Guarantor Information
                </h2>
                <p>
                    <strong>Full Name:</strong> {loan.g_full_name}
                </p>
                <p>
                    <strong>Email:</strong> {loan.g_email}
                </p>
                <p>
                    <strong>Phone:</strong> {loan.g_phone}
                </p>
                <p>
                    <strong>ID Number:</strong> {loan.g_id_number}
                </p>
                <p>
                    <strong>Address:</strong> {loan.g_address}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    
                    onClick={() => {
                        setData("status", "approved");
                        if (
                            confirm(
                                "Are you sure you want to approve this loan?"
                            )
                        ) {
                           
                            post(route("changeStatus", loan.loan_id), {
                                preserveScroll: true,
                            });
                        }
                    }}
                >
                    Approve
                </button>

                <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => {
                        setData("status", "rejected");
                        if (
                            confirm(
                                "Are you sure you want to reject this loan?"
                            )
                        ) {
                            
                            post(route("changeStatus", loan.loan_id), {
                                preserveScroll: true,
                            });
                        }
                    }}
                >
                    Reject
                </button>
            </div>
        </div>
    );
}

LoanDetails.layout = page => <Layout>{page}</Layout>