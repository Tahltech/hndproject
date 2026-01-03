import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";
import { route } from "ziggy-js";

export default function LoanRequests({ loans }) {
  const {
    data = [],
    links = [],
    current_page = 1,
    per_page = 10,
  } = loans ?? {};

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    router.get(
      "/loanadmindashboard/requests",
      { search: value, page: 1 },
      { preserveState: true, replace: true }
    );
  };

  return (
    <>
      <Head title="Loan Requests" />

      <main className="page space-y-6">
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">
            Loan Requests
          </h1>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input w-full md:w-64"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse bg-[var(--color-primary-light)] rounded-lg">
            <thead className="bg-[var(--color-primary)] text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email / Phone</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Purpose</th>
                <th className="px-4 py-2">Request Date</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted">
                    No loan requests found
                  </td>
                </tr>
              ) : (
                data.map((loan, idx) => (
                  <tr
                    key={loan.loan_id ?? loan.id}
                    className="border-b hover:bg-[var(--color-primary-light)] transition"
                  >
                    <td className="px-4 py-3">
                      {(current_page - 1) * per_page + idx + 1}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {loan.account?.user?.full_name || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <div>{loan.account?.user?.phone_number || "-"}</div>
                      <div className="text-sm text-muted">
                        {loan.account?.user?.email || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {loan.principal_amount
                        ? `XAF ${loan.principal_amount}`
                        : "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      {loan.loan_purpose || "Normal Loan"}
                    </td>

                    <td className="px-4 py-3">
                      {loan.created_at
                        ? new Date(loan.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      {loan.repayment_period
                        ? `${loan.repayment_period} months`
                        : "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          loan.status === "pending"
                            ? "badge-warning"
                            : loan.status === "approved"
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        href={route("loan.show", loan.loan_id)}
                        className="btn btn-sm btn-primary flex items-center gap-1"
                      >
                        <Icon name="eye" />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex justify-end mt-4 gap-2 flex-wrap">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url || "#"}
                  preserveScroll
                  className={`px-3 py-1 rounded border ${
                    link.active
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  } ${!link.url && "opacity-50 pointer-events-none"}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden flex flex-col gap-4">
          {data.map((loan) => (
            <div key={loan.loan_id ?? loan.id} className="card space-y-2">
              <p className="font-semibold">
                {loan.account?.user?.full_name}
              </p>
              <p className="text-sm text-muted">
                {loan.account?.user?.email}
              </p>

              <p><strong>Amount:</strong> XAF {loan.principal_amount}</p>
              <p><strong>Purpose:</strong> {loan.loan_purpose || "Normal Loan"}</p>
              <p><strong>Duration:</strong> {loan.repayment_period} months</p>

              <span
                className={`badge w-fit ${
                  loan.status === "pending"
                    ? "badge-warning"
                    : loan.status === "approved"
                    ? "badge-success"
                    : "badge-danger"
                }`}
              >
                {loan.status}
              </span>

              <Link
                href={route("loan.show", loan.loan_id)}
                className="btn btn-sm btn-primary mt-2 flex items-center gap-1"
              >
                <Icon name="eye" />
                Details
              </Link>
            </div>
          ))}

          {/* Mobile Pagination */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex justify-center mt-4 gap-2 flex-wrap">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url || "#"}
                  preserveScroll
                  className={`px-3 py-1 rounded border text-sm ${
                    link.active
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-white text-[var(--color-primary)]"
                  } ${!link.url && "opacity-50 pointer-events-none"}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

LoanRequests.layout = (page) => <AdminLayout>{page}</AdminLayout>;
