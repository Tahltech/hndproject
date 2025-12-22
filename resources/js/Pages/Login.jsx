import React from "react";
import { usePage, Link, useForm, Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import Icon from "@/Components/Icons";
import AuthLayout from "./Layout/AuthLayout";

export default function Login() {
    const { props } = usePage();
    const { errors } = props;

    const { data, post, setData, processing } = useForm({
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("submitlogin"), data);
    };

    const inputClass = (error) => `
        w-full pl-10 pr-3 py-2.5 rounded-lg border
        ${
            error
                ? "border-red-500 focus:ring-red-500"
                : "border-[var(--color-border)] focus:ring-[var(--color-primary-light)]"
        }
        focus:outline-none focus:ring-2
    `;

    const iconClass = (error) => `
        absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
        ${error ? "text-red-500" : "text-[var(--color-text-muted)]"}
    `;

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <Head title="Login" />

            <form
                className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-lg p-8"
                onSubmit={submit}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Login to continue to TahlFIN
                    </p>
                </div>

                {/* Email */}
                <div className="mb-5">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Icon
                            name="users"
                            className={iconClass(errors.email)}
                        />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="you@example.com"
                            className={inputClass(errors.email)}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <Icon
                            name="security"
                            className={iconClass(errors.password)}
                        />
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="••••••••"
                            className={inputClass(errors.password)}
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition disabled:opacity-60"
                >
                    <Icon name="dashboard" className="w-4 h-4" />
                    {processing ? "Logging in..." : "Login"}
                </button>

                {/* Footer */}
                <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                    Don’t have an account?{" "}
                    <Link
                        href={route("signup")}
                        className="font-semibold text-[var(--color-primary)] hover:underline"
                    >
                        Create one
                    </Link>
                </p>

                <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                    {" "}
                    <Link
                        href={route("signup")}
                        className="font-semibold text-[var(--color-primary)] hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </p>
            </form>
        </main>
    );
}

Login.layout = (page) => <AuthLayout>{page}</AuthLayout>;
