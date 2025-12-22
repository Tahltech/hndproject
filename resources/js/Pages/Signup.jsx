import React from "react";
import { Link, useForm, usePage, Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import Icon from "@/Components/Icons";
import AuthLayout from "./Layout/AuthLayout";

export default function Signup() {
    const { props } = usePage();
    const { errors } = props;

    const { data, post, setData, processing } = useForm({
        full_name: "",
        username: "",
        email: "",
        phone_number: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("signup"));
    };

    const inputClass = (error) => `
        w-full pl-10 pr-3 py-2.5 rounded-lg border
        ${error ? "border-red-500 focus:ring-red-500" : "border-[var(--color-border)] focus:ring-[var(--color-primary-light)]"}
        focus:outline-none focus:ring-2
    `;

    const iconClass = (error) => `
        absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
        ${error ? "text-red-500" : "text-[var(--color-text-muted)]"}
    `;

    return (
        <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
            <Head title="Register" />

            <form
                onSubmit={submit}
                className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-lg p-8"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                        Create Your Account
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Join TahlFIN and manage your finances smarter
                    </p>
                </div>

                {/* Full Name */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <Icon name="users" className={iconClass(errors.full_name)} />
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) => setData("full_name", e.target.value)}
                            placeholder="John Doe"
                            className={inputClass(errors.full_name)}
                        />
                    </div>
                </div>

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                        Username
                    </label>
                    <div className="relative">
                        <Icon name="users" className={iconClass(errors.username)} />
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData("username", e.target.value)}
                            placeholder="johndoe"
                            className={inputClass(errors.username)}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Icon name="users" className={iconClass(errors.email)} />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="you@example.com"
                            className={inputClass(errors.email)}
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Icon name="wallet" className={iconClass(errors.phone_number)} />
                        <input
                            type="text"
                            value={data.phone_number}
                            onChange={(e) => setData("phone_number", e.target.value)}
                            placeholder="+237 xxx xxx xxx"
                            className={inputClass(errors.phone_number)}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <Icon name="security" className={iconClass(errors.password)} />
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="••••••••"
                            className={inputClass(errors.password)}
                        />
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Icon name="security" className={iconClass(errors.password_confirmation)} />
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            placeholder="••••••••"
                            className={inputClass(errors.password_confirmation)}
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition disabled:opacity-60"
                >
                    <Icon name="users" className="w-4 h-4" />
                    {processing ? "Creating account..." : "Sign Up"}
                </button>

                {/* Login */}
                <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                    Already have an account?{" "}
                    <Link
                        href={route("login")}
                        className="font-semibold text-[var(--color-primary)] hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </main>
    );
}

Signup.layout = (page) => <AuthLayout>{page}</AuthLayout>;
