import AdminLayout from "@/Pages/Layout/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Transactions({ transactions }) {
    const { data = [], links = [] } = transactions;
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        router.get(
            "/accountantdmindashboard/transactions",
            { search: value, page: 1 }, // Use 'value' here
            { preserveState: true, replace: true }
        );
    };

    return (
        <>
            <Head title="Transactions" />

            <main className="page space-y-6">
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">
                    All Transactions
                </h1>

                <input
                    type="text"
                    placeholder="Search by user or reference..."
                    className="input border rounded px-3 py-2 w-full md:w-64"
                    value={search}
                    onChange={handleSearch} // triggers on each keystroke
                />

                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full bg-white rounded shadow">
                        <thead className="bg-[var(--color-primary)] text-white">
                            <tr>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Ref</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Method</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((tx) => (
                                <tr
                                    key={tx.transaction_id}
                                    className="border-b"
                                >
                                    <td className="px-4 py-2">
                                        {new Date(
                                            tx.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {tx.reference_no}
                                    </td>
                                    <td className="px-4 py-2">
                                        {tx.account?.user?.full_name || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 capitalize">
                                        {tx.type}
                                    </td>
                                    <td className="px-4 py-2">{tx.method}</td>
                                    <td className="px-4 py-2 font-semibold">
                                        XAF {tx.amount}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-2 py-1 rounded text-sm
                      ${
                          tx.status === "success" &&
                          "bg-green-100 text-green-700"
                      }
                      ${
                          tx.status === "pending" &&
                          "bg-yellow-100 text-yellow-700"
                      }
                      ${tx.status === "failed" && "bg-red-100 text-red-700"}
                    `}
                                        >
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{tx.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE CARDS */}
                <div className="md:hidden space-y-4">
                    {data.map((tx) => (
                        <div key={tx.transaction_id} className="card p-4">
                            <p className="font-semibold">XAF {tx.amount}</p>
                            <p className="text-sm">
                                {tx.type} · {tx.method}
                            </p>
                            <p className="text-sm">
                                <strong>User:</strong>{" "}
                                {tx.account?.user?.full_name || "N/A"}
                            </p>
                            <p className="text-sm">{tx.remarks}</p>
                            <p className="text-xs text-muted">
                                {new Date(tx.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* PAGINATION */}
                <div className="flex justify-end gap-2 mt-4">
                    {links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || "#"}
                            preserveScroll
                            className={`px-3 py-1 rounded border ${
                                link.active
                                    ? "bg-[var(--color-primary)] text-white"
                                    : "bg-white"
                            } ${!link.url && "opacity-50 pointer-events-none"}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </main>
        </>
    );
}

Transactions.layout = (page) => <AdminLayout>{page}</AdminLayout>;
