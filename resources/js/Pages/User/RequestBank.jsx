import React, { useState, useEffect } from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";

export default function RequestBank({ requests, banks }) {
    const { props } = usePage();
    const user = props.auth?.user;

    const { data, setData, post, processing } = useForm({
        bank_id: "",
        branch_id: "",
    });

    const [bankSearch, setBankSearch] = useState(""); // search input for banks
    const [branchSearch, setBranchSearch] = useState(""); // search input for branches
    const [filteredBanks, setFilteredBanks] = useState(banks || []);
    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);

    const hasBank = !!user.bank_name;

    // Filter banks when bankSearch changes
    useEffect(() => {
        setFilteredBanks(
            banks.filter((bank) =>
                bank.name.toLowerCase().includes(bankSearch.toLowerCase()),
            ),
        );
    }, [bankSearch, banks]);

    // Update branches when bank_id changes
    useEffect(() => {
        const selectedBank = banks.find((b) => b.bank_id == data.bank_id);
        const bankBranches = selectedBank?.branches || [];
        setBranches(bankBranches);

        // Reset branch selection
        setData("branch_id", "");
        setBranchSearch(""); // reset branch search
        setFilteredBranches(bankBranches);
    }, [data.bank_id, banks, setData]);

    // Filter branches when branchSearch changes
    useEffect(() => {
        setFilteredBranches(
            branches.filter((branch) =>
                branch.name.toLowerCase().includes(branchSearch.toLowerCase()),
            ),
        );
    }, [branchSearch, branches]);

    const cancelRequest = (userId) => {
        if (!confirm("Are you sure you want to cancel this request?")) return;

        axios
            .post(route("branch-requests.cancel", { user: userId }))
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                alert("Unable to cancel request.");
                console.error(err);
            });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("branch-requests.store"));
    };

    return (
        <>
            <Head title="Request Bank" />

            <div className="page space-y-6">
                {!hasBank ? (
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-4">
                            Request Bank Access
                        </h2>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Bank Search */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Select Bank
                                </label>
                                <input
                                    type="text"
                                    className="input w-full mb-2"
                                    placeholder="Search bank..."
                                    value={bankSearch}
                                    onChange={(e) =>
                                        setBankSearch(e.target.value)
                                    }
                                />
                                <select
                                    className="input w-full"
                                    value={data.bank_id}
                                    onChange={(e) =>
                                        setData("bank_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">-- Choose Bank --</option>
                                    {filteredBanks.map((bank) => (
                                        <option
                                            key={bank.bank_id}
                                            value={bank.bank_id}
                                        >
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Branch Search */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Select Branch
                                </label>
                                <input
                                    type="text"
                                    className="input w-full mb-2"
                                    placeholder="Search branch..."
                                    value={branchSearch}
                                    onChange={(e) =>
                                        setBranchSearch(e.target.value)
                                    }
                                    disabled={!data.bank_id}
                                />
                                <select
                                    className="input w-full"
                                    value={data.branch_id}
                                    onChange={(e) =>
                                        setData("branch_id", e.target.value)
                                    }
                                    required
                                    disabled={!data.bank_id}
                                >
                                    <option value="">
                                        -- Choose Branch --
                                    </option>
                                    {filteredBranches.map((branch) => (
                                        <option
                                            key={branch.branch_id}
                                            value={branch.branch_id}
                                        >
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary"
                            >
                                {processing ? "Sending..." : "Send Request"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="alert alert-warning">
                        You already belong to a bank. You cannot request
                        another.
                    </div>
                )}

                {/* User Requests */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">
                        Your Requests
                    </h2>
                    {requests.length === 0 ? (
                        <p className="text-muted">No requests sent yet.</p>
                    ) : (
                        <ul className="divide-y divide-[var(--color-border)]">
                            {requests.map((req) => (
                                <li
                                    key={req.user_id}
                                    className="px-4 py-3 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {req.branch?.bank?.name} /{" "}
                                            {req.branch?.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`badge 
                    ${req.status === "pending" ? "badge-warning" : ""}
                    ${req.status === "approved" ? "badge-success" : ""}
                    ${req.status === "rejected" ? "badge-danger" : ""}
                `}
                                        >
                                            {req.status}
                                        </span>

                                        {req.status === "pending" &&
                                            new Date(req.created_at) >=
                                                new Date(
                                                    Date.now() -
                                                        48 * 60 * 60 * 1000,
                                                ) && (
                                                <button
                                                    onClick={() =>
                                                        cancelRequest(
                                                            req.user_id,
                                                        )
                                                    }
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

RequestBank.layout = (page) => <AppLayout>{page}</AppLayout>;
