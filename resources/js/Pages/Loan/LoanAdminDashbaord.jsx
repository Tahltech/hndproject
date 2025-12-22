import { route } from "ziggy-js";
//import Layout from "../Layout/Layout";
import { Link, useForm,router} from "@inertiajs/react";
import { useState, useMemo } from "react";
import AllertMessage from "../../Components/AlertMessage";

export default function LoanDashboard({ loanRequests }) {
    const { put } = useForm();
    const [search, setSearch] = useState("");

    // filter loans based on search query
    const filteredLoans = useMemo(() => {
        if (!search) return loanRequests;

        return loanRequests.filter((loan) => {
            const fullName = loan.account?.user?.full_name?.toLowerCase() || "";
            const email = loan.account?.user?.email?.toLowerCase() || "";
            return (
                fullName.includes(search.toLowerCase()) ||
                email.includes(search.toLowerCase())
            );
        });
    }, [search, loanRequests]);

     const submit = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <main>
            <h2>Welcome Loan Admin</h2>
            <AllertMessage />

            <div className="bg-white shadow-md rounded-lg p-6 mt-5 mb-12">
                <h3 className="text-lg font-semibold mb-4">
                    Loan Demanded This Week
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ">
                    {/* Total Loan Amount */}
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-sm">Total Loan Amount</span>
                        <span className="text-2xl font-bold">
                            XAF{" "}
                            {loanRequests.reduce(
                                (sum, loan) =>
                                    sum + Number(loan.principal_amount || 0),
                                0
                            )}
                        </span>
                    </div>

                    {/* Pending Loans */}
                    <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-sm">Pending Loans</span>
                        <span className="text-2xl font-bold">
                            {
                                loanRequests.filter(
                                    (loan) => loan.status === "pending"
                                ).length
                            }
                        </span>
                    </div>

                    {/* Approved Loans */}
                    <div className="bg-green-100 text-green-800 rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-sm">Approved Loans</span>
                        <span className="text-2xl font-bold">
                            {
                                loanRequests.filter(
                                    (loan) => loan.status === "approved"
                                ).length
                            }
                        </span>
                    </div>
                </div>

                <div className="bg-green-100 text-green-800 rounded-lg p-4 flex flex-col items-center justify-center">
                    <span className="text-sm">Total Loan Amount Approved</span>
                    <span className="text-2xl font-bold">
                        XAF{" "}
                        {loanRequests
                            .filter((loan) => loan.status === "approved")
                            .reduce(
                                (sum, loan) =>
                                    sum + Number(loan.principal_amount || 0),
                                0
                            )}
                    </span>
                </div>
            </div>

            {/* Search input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="mt-4">
                <h3>Loan Requests</h3>

                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md mt-2">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Full Name</th>
                            <th className="py-3 px-4 text-left">Phone/Email</th>
                            <th className="py-3 px-4 text-left">
                                Amount Requested
                            </th>
                            <th className="py-3 px-4 text-left">
                                Loan Purpose
                            </th>
                            <th className="py-3 px-4 text-left">
                                Request Date
                            </th>
                            <th className="py-3 px-4 text-left">Demand Date</th>
                            <th className="py-3 px-4 text-left">
                                Duration/Term
                            </th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredLoans.length > 0 ? (
                            filteredLoans.map((loan) => (
                                <tr
                                    key={loan.loan_id ?? loan.id}
                                    className="border-b hover:bg-gray-100 transition"
                                >
                                    <td className="py-2 px-4">
                                        {loan.account?.user?.full_name ?? "N/A"}
                                    </td>
                                    <td className="py-2 px-4">
                                        <div>
                                            {loan.account?.user?.phone_number}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {loan.account?.user?.email}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-semibold">
                                        {loan.principal_amount
                                            ? `XAF ${loan.principal_amount}`
                                            : "N/A"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {loan.loan_purpose
                                            ? `${loan.loan_purpose}`
                                            : "Normal Loan"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {loan.created_at
                                            ? new Date(
                                                  loan.created_at
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {loan.repayment_period &&
                                        loan.created_at
                                            ? new Date(
                                                  new Date(
                                                      loan.created_at
                                                  ).setMonth(
                                                      new Date(
                                                          loan.created_at
                                                      ).getMonth() +
                                                          Number(
                                                              loan.repayment_period
                                                          )
                                                  )
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {loan.repayment_period} months
                                    </td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${
                                                loan.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : loan.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <Link
                                            href={route(
                                                "loan.show",
                                                loan.loan_id
                                            )}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                        >
                                            Show
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="py-3 text-center text-gray-500"
                                >
                                    No loan requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-5">
                <Link
                    href={route("availableusers")}
                    className="font-bold text-blue-600 bg-white px-5 rounded py-2 mb-5 mt-4 shadow"
                >
                    Available Users
                </Link>
            </div>

             <form onSubmit={submit}>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-green-700"
                    >
                        Logout
                    </button>
                </form>
        </main>
    );
}

//LoanDashboard.layout = (page) => <Layout>{page}</Layout>;
