import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "../Layout/AdminLayout";

export default function CreateStaff() {
    const { post, setData, data, processing } = useForm({
        full_name: "",
        username: "",
        phone_number: "",
        email: "",
        role: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("branch_staff"));
    };

    return (
        <main className="page space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        Create Branch Staff
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Fill out the form below to register a new branch staff.
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="card max-w-lg mx-auto p-6">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={data.full_name}
                        onChange={(e) => setData("full_name", e.target.value)}
                        className="input"
                    />

                    <input
                        type="text"
                        placeholder="Username"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        className="input"
                    />

                    <input
                        type="number"
                        placeholder="Phone Number"
                        value={data.phone_number}
                        onChange={(e) => setData("phone_number", e.target.value)}
                        className="input"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="input"
                    />

                    <select
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                        className="input"
                    >
                        <option value="" disabled>
                            Select Role
                        </option>
                        <option value="branch_manager">Branch Manager</option>
                        <option value="agent">Agent</option>
                        <option value="loan_officer">Loan Officer</option>
                        <option value="support_officer">Support Officer</option>
                        <option value="accountant">Accountant</option>
                    </select>

                    <input
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="input"
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary mt-4"
                    >
                        {processing ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </main>
    );
}

CreateStaff.layout = (page) => <AdminLayout>{page}</AdminLayout>;
