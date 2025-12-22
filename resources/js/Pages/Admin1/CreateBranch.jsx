import React from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "../Layout/AdminLayout";

export default function CreateBranch() {
    const { data, setData, post, processing } = useForm({
        name: "",
        address: "",
        contact_number: "",
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("storebranch"));
    };

    return (
        <>
            <Head title="Create Branch" />

            <main className="page max-w-4xl mx-auto space-y-6">
                {/* ===== Header ===== */}
                <div className="flex-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Create Bank Branch
                        </h1>
                        <p className="text-muted text-sm mt-1">
                            Add a new branch under your bank
                        </p>
                    </div>

                    <Link
                        href={route("bnkadmindashboard")}
                        className="btn btn-outline"
                    >
                        Back
                    </Link>
                </div>

                {/* ===== Form Card ===== */}
                <div className="card">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Branch Name */}
                        <div>
                            <label className="text-sm font-medium">
                                Branch Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="e.g. Central Branch"
                                className="input mt-1"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="text-sm font-medium">
                                Branch Address
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                placeholder="Branch physical address"
                                className="input mt-1"
                            />
                        </div>

                        {/* Contact + Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value
                                        )
                                    }
                                    placeholder="+237..."
                                    className="input mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Branch Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="branch@bank.com"
                                    className="input mt-1"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Link
                                href={route("bnkadmindashboard")}
                                className="btn btn-outline"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary"
                            >
                                {processing
                                    ? "Creating..."
                                    : "Create Branch"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

CreateBranch.layout = (page) => <AdminLayout>{page}</AdminLayout>;
