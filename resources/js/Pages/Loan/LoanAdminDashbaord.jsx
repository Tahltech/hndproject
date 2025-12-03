import Layout from "../Layout/Layout";
import { Link } from "@inertiajs/react";

export default function LoanDashboard({ loanRequests }) {
    return (
        <main>
            <h2>Welcome Loan Admin</h2>

            <div>
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
                        {loanRequests && loanRequests.length > 0 ? (
                            loanRequests.map((loan) => (
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
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                            View
                                        </button>
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
        </main>
    );
}

LoanDashboard.layout = (page) => <Layout>{page}</Layout>;
