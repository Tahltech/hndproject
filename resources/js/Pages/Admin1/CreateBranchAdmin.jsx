import { useForm, Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import React, { useState } from "react";
import Icon from "@/Components/Icons";
import AdminLayout from "../Layout/AdminLayout";

export default function CreateBranchAdmin({ branch }) {
    const [showForm, setShowForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing } = useForm({
        full_name: "",
        username: "",
        email: "",
        branch_id: branch.branch_id,
        phone_number: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("storeBranchAdmin"));
    };

    return (
        <>
            <Head title={`${branch.name} – Branch Admins`} />

            <main className="page max-w-5xl mx-auto space-y-8">
                {/* ===== Header ===== */}
                <div className="flex-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {branch.name} Branch Admins
                        </h1>
                        <p className="text-muted text-sm mt-1">
                            Manage administrators for this branch
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary"
                    >
                        {showForm ? "Close Form" : "Create Admin"}
                    </button>
                </div>

                {/* ===== Branch Info ===== */}
                <div className="card">
                    <h2 className="font-semibold text-lg mb-3">
                        Branch Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <p className="text-muted">Branch Name</p>
                            <p className="font-medium">{branch.name}</p>
                        </div>

                        <div>
                            <p className="text-muted">Email</p>
                            <p className="font-medium">{branch.email}</p>
                        </div>

                        <div>
                            <p className="text-muted">Contact Number</p>
                            <p className="font-medium">
                                {branch.contact_number}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== Animated Form ===== */}
                <div
                    className={`
                        transition-all duration-300 ease-out
                        ${showForm ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
                    `}
                >
                    {showForm && (
                        <div className="card max-w-3xl ml-auto">
                            <h3 className="text-lg font-semibold mb-4">
                                Create Branch Admin
                            </h3>

                            <form
                                onSubmit={submit}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {/* Full Name */}
                                <div>
                                    <label className="text-sm font-medium">
                                        Full Name
                                    </label>
                                    <input
                                        className="input mt-1"
                                        type="text"
                                        value={data.full_name}
                                        onChange={(e) =>
                                            setData(
                                                "full_name",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="text-sm font-medium">
                                        Username
                                    </label>
                                    <input
                                        className="input mt-1"
                                        type="text"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData(
                                                "username",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        className="input mt-1"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-sm font-medium">
                                        Phone Number
                                    </label>
                                    <input
                                        className="input mt-1"
                                        type="text"
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData(
                                                "phone_number",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <label className="text-sm font-medium">
                                        Password
                                    </label>
                                    <input
                                        className="input mt-1 pr-10"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-[42px] text-muted"
                                    >
                                        <Icon
                                            name={
                                                showPassword
                                                    ? "eye-off"
                                                    : "eye"
                                            }
                                        />
                                    </button>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="text-sm font-medium">
                                        Confirm Password
                                    </label>
                                    <input
                                        className="input mt-1"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* Actions */}
                                <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn btn-outline"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn btn-primary"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Admin"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

CreateBranchAdmin.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
);
