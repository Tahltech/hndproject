import React from "react";
import { useForm } from "@inertiajs/react";
import { name } from "ejs";
import { route } from "ziggy-js";

export default function CreateStaff() {
    const { post, setData, data } = useForm({
        full_name: "",
        username: "",
        phone_number: "",
        email: "",
        role: "",
        password: "",
    });
    const submit = (e) => {
        e.preventDefault();
        post(route("branch_staff"), data);
    };
    return (
        <>
            <h1>Create Branch Staff's</h1>

            <form
                onSubmit={submit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
            >
                <div>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={data.full_name}
                        onChange={(e) => setData("full_name", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Enter User Name"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Enter Phone Number"
                        value={data.phone_number}
                        onChange={(e) => setData("phone_number", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <select
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="branch_manager">Branch Manager</option>
                        <option value="agent">Agent</option>
                        <option value="loan_officer">Loan Officer</option>
                        <option value="support_officer">Support Officer</option>
                        <option value="accountant">Accountant</option>
                    </select>
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="px-6 py-3 mt-4 text-lg font-semibold text-white bg-green-700 rounded-lg shadow hover:bg-green-800 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-200"
                >
                    Register
                </button>
            </form>
        </>
    );
}
