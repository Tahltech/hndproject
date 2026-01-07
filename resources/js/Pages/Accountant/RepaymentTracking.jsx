import AdminLayout from "@/Pages/Layout/AdminLayout";
import { Link, Head } from "@inertiajs/react";

export default function RepaymentTracking({ repayments }) {
    return (
        <main className="page space-y-6">
            <Head title="Laon Repayment" />
            <h2 className="text-2xl font-bold brand-accent">
                Repayment Tracking
            </h2>

            <div className="card overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-sm text-muted border-b">
                            <th className="py-2">Borrower</th>
                            <th>Loan Amount</th>
                            <th>Repaid</th>
                            <th>Balance</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {repayments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="py-6 text-center text-muted"
                                >
                                    No repayment data available
                                </td>
                            </tr>
                        ) : (
                            repayments.map((row) => (
                                <tr key={row.id} className="border-b text-sm">
                                    <td className="py-3 font-medium">
                                        {row.borrower}
                                    </td>
                                    <td>XAF {row.amount}</td>
                                    <td className="success">
                                        XAF {row.repaid}
                                    </td>
                                    <td className="warning">
                                        XAF {row.balance}
                                    </td>
                                    <td>{row.due_date}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                row.status === "completed"
                                                    ? "badge-success"
                                                    : row.status === "overdue"
                                                    ? "badge-danger"
                                                    : "badge-warning"
                                            }`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            href={route(
                                                "repayments.history",
                                                row.id
                                            )}
                                            className="btn btn-sm btn-outline"
                                        >
                                            Repayments
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

RepaymentTracking.layout = (page) => <AdminLayout>{page}</AdminLayout>;
