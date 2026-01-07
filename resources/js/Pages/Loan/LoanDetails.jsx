import React from "react";
import { route } from "ziggy-js";
import { useForm, Head, Link } from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";

export default function LoanDetails({ loan }) {
  const { setData, post } = useForm({ status: "" });

  const statusClasses = {
    pending:
      "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
    approved:
      "bg-[var(--color-success-light)] text-[var(--color-success)]",
    rejected:
      "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
  };

  const handleAction = (status) => {
    setData("status", status);
    if (confirm(`Are you sure you want to ${status} this loan?`)) {
      post(route("changeStatus", loan.loan_id), { preserveScroll: true });
    }
  };

  return (
    <>
      <Head title="Loan Details" />

      <div className="page max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">
            Loan Details
          </h1>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${
              statusClasses[loan.status] ??
              "bg-gray-100 text-gray-600"
            }`}
          >
            {loan.status}
          </span>
        </div>


        {/* Loan Info */}
        <section className="card p-6 space-y-4">
          <h2 className="section-title">Loan Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p><strong>Loan ID:</strong> {loan.loan_id}</p>
            <p><strong>Account ID:</strong> {loan.account_id}</p>
            <p><strong>Amount:</strong> XAF {loan.principal_amount}</p>
            <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
            <p>
              <strong>Repayment Period:</strong>{" "}
              {loan.repayment_period} months
            </p>
            <p>
              <strong>Requested On:</strong>{" "}
              {new Date(loan.created_at).toLocaleString()}
            </p>
            <p className="sm:col-span-2">
              <strong>Purpose:</strong>{" "}
              {loan.loan_purpose || "Normal Loan"}
            </p>
          </div>
        </section>

        {/* Borrower */}
        <section className="card p-6 space-y-4">
          <h2 className="section-title">Borrower Information</h2>

          {loan.account?.user ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Full Name:</strong>{" "}
                {loan.account.user.full_name}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {loan.account.user.email}
              </p>
              <p>
                <strong>ID Number:</strong> {loan.id_number}
              </p>
              <p>
                <strong>Address:</strong> {loan.address}
              </p>
            </div>
          ) : (
            <p className="text-muted">User information not available</p>
          )}
        </section>

        {/* Guarantor */}
        <section className="card p-6 space-y-4">
          <h2 className="section-title">Guarantor Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p><strong>Full Name:</strong> {loan.g_full_name}</p>
            <p><strong>Email:</strong> {loan.g_email}</p>
            <p><strong>Phone:</strong> {loan.g_phone}</p>
            <p><strong>ID Number:</strong> {loan.g_id_number}</p>
            <p className="sm:col-span-2">
              <strong>Address:</strong> {loan.g_address}
            </p>
          </div>
        </section>

        {/* Actions */}
        {loan.status === "pending" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleAction("approved")}
              className="btn btn-success"
            >
              Approve Loan
            </button>

            <button
              onClick={() => handleAction("rejected")}
              className="btn btn-danger"
            >
              Reject Loan
            </button>
          </div>
        )}

        <Link
          href={route("showrequests")}
          className="inline-block text-sm text-[var(--color-primary)] hover:underline"
        >
          ← Back to Loan Requests
        </Link>
      </div>
      {/* Repayment Schedule */}
<section className="card p-6 space-y-4">
  <h2 className="section-title">Repayment Schedule</h2>

  {loan.repayments?.length === 0 ? (
    <p className="text-muted">No repayments generated yet</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-[var(--color-primary)] text-white">
          <tr>
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Due Date</th>
            <th className="px-3 py-2">Amount Due</th>
            <th className="px-3 py-2">Amount Paid</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {loan.repayments.map((repayment, index) => (
            <tr key={repayment.id} className="border-b">
              <td className="px-3 py-2">{index + 1}</td>
              <td className="px-3 py-2">
                {new Date(repayment.due_date).toLocaleDateString()}
              </td>
              <td className="px-3 py-2">
                XAF {repayment.amount_due}
              </td>
              <td className="px-3 py-2">
                XAF {repayment.amount_paid}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    repayment.status === "paid"
                      ? "bg-[var(--color-success-light)] text-[var(--color-success)]"
                      : repayment.status === "overdue"
                      ? "bg-[var(--color-danger-light)] text-[var(--color-danger)]"
                      : "bg-[var(--color-warning-light)] text-[var(--color-warning)]"
                  }`}
                >
                  {repayment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

    </>
  );
}

LoanDetails.layout = (page) => <AdminLayout>{page}</AdminLayout>;
