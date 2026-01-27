import React from "react";
import { usePage, useForm, Head } from "@inertiajs/react";
import AdminLayout from "@/Pages/Layout/AdminLayout";
import { route } from "ziggy-js";

export default function CreateBank() {
    const { props } = usePage();
    const { errors } = props;

    const { data, setData, post } = useForm({
        name: "",
        address: "",
        contact_number: "",
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("itadmin.newbank"), data);
    };

    return (
        <>
            <Head title="Create Bank" />
            <main className="page max-w-3xl mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
                    Create Bank
                </h1>

                <div className="card">
                    <form
                        onSubmit={submit}
                        className="space-y-4"
                    >
                        {/* Bank Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Bank Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                placeholder="Enter Bank Name"
                                onChange={(e) => setData("name", e.target.value)}
                                className="input"
                            />
                            {errors.name && (
                                <p className="text-sm text-[var(--color-warning)] mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Bank Address
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                placeholder="Enter Bank Address"
                                onChange={(e) => setData("address", e.target.value)}
                                className="input"
                            />
                            {errors.address && (
                                <p className="text-sm text-[var(--color-warning)] mt-1">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                value={data.contact_number}
                                placeholder="Enter Contact Number"
                                onChange={(e) => setData("contact_number", e.target.value)}
                                className="input"
                            />
                            {errors.contact_number && (
                                <p className="text-sm text-[var(--color-warning)] mt-1">
                                    {errors.contact_number}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                placeholder="Enter Bank Email"
                                onChange={(e) => setData("email", e.target.value)}
                                className="input"
                            />
                            {errors.email && (
                                <p className="text-sm text-[var(--color-warning)] mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full py-3 mt-4 text-lg font-semibold shadow"
                        >
                            Create Bank
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}

CreateBank.layout = (page) => <AdminLayout>{page}</AdminLayout>;
