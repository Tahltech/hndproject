import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Pages/Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function CreateBankAdmin({ bank }) {
    const [showForm, setShowForm] = useState(false);

    const { data, post, setData, processing, errors } = useForm({
        full_name: "",
        username: "",
        email: "",
        phone_number: "",
        password: "",
        password_confirmation: "",
        bank_id: bank.bank_id,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("itadmin.bank.admin"));
    };

    const { delete: destroy } = useForm();

    const deleteBank = (bankId) => {
        if (!confirm("Are you sure you want to delete this bank?")) return;

        destroy(route("itadmin.delete", bankId), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Bank deleted successfully");
            },
            onError: () => {
                console.log("Failed to delete bank");
            },
        });
    };

    return (
        <>
            <Head title="Create Bank Admin" />

            <main className="space-y-8 max-w-5xl mx-auto">
                {/* Bank Info Card  */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h1 className="text-xl font-bold mb-4">
                        {bank.name} - Bank Information
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-[var(--color-text-muted)]">
                                Bank Name
                            </p>
                            <p className="font-semibold">{bank.name}</p>
                        </div>

                        <div>
                            <p className="text-[var(--color-text-muted)]">
                                Email
                            </p>
                            <p className="font-semibold">
                                {bank.email || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[var(--color-text-muted)]">
                                Contact Number
                            </p>
                            <p className="font-semibold">
                                {bank.contact_number || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== Action Button ===== */}
                <div className="flex justify-between gap-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="
            flex items-center gap-2
            bg-[var(--color-primary)]
            text-white
            px-5 py-2.5
            rounded-xl
            hover:opacity-90
            transition
        "
                    >
                        <Icon name="user-plus" className="w-4 h-4" />
                        {showForm ? "Hide Form" : "Create Bank Admin"}
                    </button>

                    <button
                        onClick={()=>deleteBank(bank.bank_id)}
                        className="
                         flex items-center gap-2
                 bg-[var(--color-danger)]
             text-white
            px-5 py-2.5
            rounded-xl
            hover:opacity-90
            transition "
                    >
                        Delete Bank
                    </button>
                </div>

                {/*  Create Admin Form*/}
                {showForm && (
                    <form
                        onSubmit={submit}
                        className="
                            bg-[var(--color-surface)]
                            border border-[var(--color-border)]
                            rounded-2xl
                            p-6
                            shadow-sm
                            max-w-xl
                        "
                    >
                        <h2 className="text-lg font-semibold mb-6">
                            Create Admin Account
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData("full_name", e.target.value)
                                }
                                className="input"
                            />

                            <input
                                type="text"
                                placeholder="Username"
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                                className="input"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="input"
                            />

                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData("phone_number", e.target.value)
                                }
                                className="input"
                            />

                           
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="
                                    w-full
                                    bg-[var(--color-primary)]
                                    text-white
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    hover:opacity-90
                                    transition
                                    disabled:opacity-60
                                "
                            >
                                {processing
                                    ? "Creating Admin..."
                                    : "Create Admin"}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </>
    );
}

CreateBankAdmin.layout = (page) => <AdminLayout>{page}</AdminLayout>;
