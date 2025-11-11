import Layout from "@/Pages/Layout/Layout";
import { useForm, usePage, Link, Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import React, { useState } from "react";

export default function CraeteBranchAdmin({ branch}) {
    const { props } = usePage();
    const { errors } = props;
    const [showForm, setShowForm] = useState(false);

    const { data, post, setData, processing } = useForm({
        full_name: "",
        username: "",
        email: "",
        branch_id: branch.branch_id,
        phone_number: "",
        password: "",
        password_confirmation: "",
    });

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("storeBranchAdmin"));
    };
    return (
        <main className="flex justify-center items-center min-h-screen bg-gray-100 flex-col">
            <Head title="Branch" />
            <h1 className="mb-3 mt-0.5 ">
                {/* {branch?.name ? `${branch.name} ` : ""} branchs Information */}
            </h1>

            <div className="mt-2 mb-5 *:">
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td className="mr-2 ml-2">Email</td>
                            <td>Phone</td>
                        </tr>
                        <tr>
                            <td>{branch.name}</td>
                            <td className="mr-4 ml-4">{branch.email}</td>
                            <td>{branch.contact_number}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="p-6 w-100">
                {/* Button to show/hide the form */}
                <button
                    onClick={toggleForm}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    {showForm ? "Hide Form" : "Create New Admin"}
                </button>

                {/* Conditionally render the form */}
                {showForm && (
                    <form
                        onSubmit={submit}
                        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm mx-auto mt-6"
                    >
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
                            Create Admin Account
                        </h2>

                        {/* Full Name */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        full_name: e.target.value,
                                    })
                                }
                                placeholder="Full Name"
                                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Username */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        username: e.target.value,
                                    })
                                }
                                placeholder="Username"
                                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData({ ...data, email: e.target.value })
                                }
                                placeholder="Email"
                                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="mb-4">
                            <input
                                type="number"
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        phone_number: e.target.value,
                                    })
                                }
                                placeholder="Phone Number"
                                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="Password"
                                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        password_confirmation: e.target.value,
                                    })
                                }
                                placeholder="Confirm Password"
                                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {processing ? "Creating..." : "Sign Up"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}

CraeteBranchAdmin.layout = (page) => <Layout>{page}</Layout>;
