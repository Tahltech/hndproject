import AdminLayout from "@/Pages/Layout/AdminLayout";
import { Link } from "@inertiajs/react";

export default function RepaymentHistory({ loan, repayments }) {
  return (
    <main className="page space-y-6">
      {/* Header */}
      <div className="flex-between">
        <h2 className="text-2xl font-bold brand-accent">
          Repayment History
        </h2>

        <Link
          href={route("loan.repayments")}
          className="btn btn-outline"
        >
          ← Back
        </Link>
      </div>

      {/* Loan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-muted text-sm">Loan Amount</p>
          <h3 className="text-xl font-bold">
            XAF {loan.amount}
          </h3>
        </div>

        <div className="card">
          <p className="text-muted text-sm">Total Repaid</p>
          <h3 className="text-xl font-bold success">
            XAF {loan.repaid}
          </h3>
        </div>

        <div className="card">
          <p className="text-muted text-sm">Outstanding Balance</p>
          <h3 className="text-xl font-bold warning">
            XAF {loan.balance}
          </h3>
        </div>
      </div>

      {/* Repayment Table */}
      <div className="card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b text-sm text-muted">
            <tr>
              <th className="py-2 text-left">#</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Method</th>
              <th className="text-left">Reference</th>
              <th className="text-left">Paid At</th>
            </tr>
          </thead>

          <tbody>
            {repayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-muted">
                  No repayments recorded yet
                </td>
              </tr>
            ) : (
              repayments.map((repayment, idx) => (
                <tr key={repayment.id} className="border-b text-sm">
                  <td className="py-3">{idx + 1}</td>
                  <td className="font-semibold">
                    XAF {repayment.amount}
                  </td>
                  <td>{repayment.payment_method || "-"}</td>
                  <td>{repayment.reference || "-"}</td>
                  <td>
                    {new Date(repayment.paid_at).toLocaleString()}
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

RepaymentHistory.layout = (page) => <AdminLayout>{page}</AdminLayout>;
