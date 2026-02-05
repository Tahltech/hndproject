import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        axios
            .get("/agentadmindashboard/agent/transactions")
            .then((res) => {
                setTransactions(res.data.transactions || []);
            })
            .catch((err) => {
                console.error("Error fetching transactions:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading) {
        return <p>Loading transactions...</p>;
    }

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Client Transactions</h2>

            {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Client</th>
                                <th className="text-left py-2">Account</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-left py-2">Amount</th>
                                <th className="text-left py-2">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((trx) => (
                                <tr
                                    key={trx.transaction_id}
                                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <td className="py-2">{trx.full_name}</td>

                                    <td className="py-2">
                                        {trx.account_number}
                                    </td>

                                    <td className="py-2">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                                trx.type === "deposit"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {trx.type}
                                        </span>
                                    </td>

                                    <td className="py-2 font-medium">
                                        {Number(trx.amount).toLocaleString()}{" "}
                                        FCFA
                                    </td>

                                    <td className="py-2 text-sm text-gray-500">
                                        {new Date(
                                            trx.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
