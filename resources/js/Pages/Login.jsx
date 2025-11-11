import React from "react";
import { usePage, Link, useForm, Head } from "@inertiajs/react";
//import Layout from "@/Pages/Layout/Layout";
import { route } from "ziggy-js";

export default function Login() {
    const { props } = usePage(); // Access props (errors, flash, etc.)
    const { errors } = props;

    const { data, post, setData, processing } = useForm({
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        // Send the form data explicitly
        post(route("submitlogin"), data);
    };

    return (
        <main className="flex justify-center items-center min-h-screen bg-gray-100">
            <Head title="Login" />

            <form
                onSubmit={submit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
                    Login to Your Account
                </h2>

                {/* Email */}
                <div className="mb-4">
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Enter your email"
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Enter your password"
                        className={`w-full p-2 border-b-2 ${
                            errors.password
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:outline-none focus:border-blue-500`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {processing ? "Logging in..." : "Login"}
                </button>

                {/* Signup Link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link
                        href={route("signup")}
                        className="text-blue-600 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>

                {/* Global Error (like invalid credentials) */}
                {errors.email && !errors.password && (
                    <p className="text-red-500 text-center text-sm mt-4">
                        {errors.email}
                    </p>
                )}
            </form>
        </main>
    );
}

//Login.layout = (page) => <Layout>{page}</Layout>;
