import React from "react";
import { Link, useForm, usePage, Head } from "@inertiajs/react";
import { route } from "ziggy-js";
//import Layout from "./Layout/Layout";

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

    return (
        <main className="flex justify-center items-center min-h-screen bg-gray-100">
            <Head title="Register" />
            <form
                onSubmit={submit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm mx-2"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
                    Create an Account
                </h2>

                {/* Full Name */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={data.full_name}
                        onChange={(e) => setData("full_name", e.target.value)}
                        placeholder="Full Name"
                        className={`w-full p-2 border-b-2 ${
                            errors.full_name
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:outline-none focus:border-blue-500`}
                    />
                    {errors.full_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.full_name}
                        </p>
                    )}
                </div>

                {/* Username */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        placeholder="Username"
                        className={`w-full p-2 border-b-2 ${
                            errors.username
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:outline-none focus:border-blue-500`}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.username}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Email"
                        className={`w-full p-2 border-b-2 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:border-blue-500`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <input
                        type="number"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData("phone_number", e.target.value)
                        }
                        placeholder="Phone Number"
                        className={`w-full p-2 border-b-2 ${
                            errors.phone_number
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:outline-none focus:border-blue-500`}
                    />
                    {errors.phone_number && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.phone_number}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Password"
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

                {/* Confirm Password */}
                <div className="mb-6">
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        placeholder="Confirm Password"
                        className={`w-full p-2 border-b-2 ${
                            errors.password_confirmation
                                ? "border-red-500"
                                : "border-gray-300"
                        } focus:outline-none focus:border-blue-500`}
                    />
                    {errors.password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {processing ? "Creating account..." : "Sign Up"}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link
                        href={route("login")}
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </main>
    );
}

//Signup.layout = (page) => <Layout>{page}</Layout>;
