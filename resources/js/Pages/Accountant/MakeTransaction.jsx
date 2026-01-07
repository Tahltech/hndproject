import AdminLayout from "@/Pages/Layout/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";

export default function MakeTransaction() {
    const [search, setSearch] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        account_id: "",
        type: "in",
        channel: "cash",
        amount: "",
        reference: "",
        note: "",
    });
    const searchAccounts = async (value) => {
        setSearch(value);

        if (value.length < 2) {
            setAccounts([]);
            return;
        }

        try {
            const res = await axios.get(route("account.search"), {
                params: { search: value },
            });

            setAccounts(res.data);
        } catch (error) {
            console.error("Account search failed:", error);
        }
    };


    /* select account */
    const selectAccount = (account) => {
        setSelectedAccount(account);
        setData("account_id", account.id);
        setAccounts([]);
        setSearch(account.user.full_name);
    };

    /* submit transaction */
    const submit = (e) => {
        e.preventDefault();
        post(route("accountant.transactions.store"));
    };

    return (
        <>
            <Head title="Make Transaction" />

            <main className="page max-w-3xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">
                    Make Transaction
                </h1>

                <form onSubmit={submit} className="card space-y-5">
                    {/* Search User */}
                    <div>
                        <label className="label">Search User / Account</label>
                        <input
                            value={search}
                            onChange={(e) => searchAccounts(e.target.value)}
                            className="input"
                            placeholder="Search by name, account no, phone..."
                        />

                        {accounts.length > 0 && (
                            <div className="border rounded mt-2 bg-white">
                                {accounts.map((acc) => (
                                    <div
                                        key={acc.id}
                                        onClick={() => selectAccount(acc)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {acc.user.full_name} –{" "}
                                        {acc.account_number}
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.account_id && (
                            <p className="text-red-500 text-sm">
                                {errors.account_id}
                            </p>
                        )}
                    </div>

                    {/* Account Info */}
                    {selectedAccount && (
                        <div className="grid grid-cols-3 gap-4 bg-[var(--color-surface)] p-4 rounded">
                            <div>
                                <p className="text-xs text-gray-500">Name</p>
                                <p className="font-semibold">
                                    {selectedAccount.user.full_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Account No
                                </p>
                                <p className="font-semibold">
                                    {selectedAccount.account_id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Balance</p>
                                <p className="font-semibold">
                                    XAF {selectedAccount.balance}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Transaction Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Transaction Type</label>
                            <select
                                className="input"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                            >
                                <option value="in">Deposit</option>
                                <option value="out">Withdrawal</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Channel</label>
                            <select
                                className="input"
                                value={data.channel}
                                onChange={(e) =>
                                    setData("channel", e.target.value)
                                }
                            >
                                <option value="cash">Cash</option>
                                <option value="momo">MoMo</option>
                                <option value="bank">Bank</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Amount (XAF)</label>
                            <input
                                type="number"
                                className="input"
                                value={data.amount}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
                            />
                            {errors.amount && (
                                <p className="text-red-500 text-sm">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="label">Reference</label>
                            <input
                                className="input"
                                value={data.reference}
                                onChange={(e) =>
                                    setData("reference", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Note (optional)</label>
                        <textarea
                            className="input"
                            value={data.note}
                            onChange={(e) => setData("note", e.target.value)}
                        />
                    </div>

                    <button
                        disabled={processing}
                        className="btn btn-primary w-full"
                    >
                        Submit Transaction
                    </button>
                </form>
            </main>
        </>
    );
}

MakeTransaction.layout = (page) => <AdminLayout>{page}</AdminLayout>;
