import React from "react";
import { usePage, Link, useForm, Head } from "@inertiajs/react";
import Layout from "@/Pages/Layout/Layout";
import { route } from "ziggy-js";
import { set } from "mongoose";

export default function CreateBank() {
    const { props } = usePage(); 
    const { errors } = props;
    const { data, setData, post } = useForm({
        name: "",
        address: "",
        contact_number:"",
        email:"",

    });
    const submit = (e) => {
        e.preventDefault();

        post(route("newbank"),data);
    };
    return (
        <main>
             <Head title="CreateBank" />
            <div className="p-6 mt-10">
                <Head title="Create Bank" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Create Bank
                </h1>
                <form
                    onSubmit={submit}
                    className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
                >
                    <input
                        type="name"
                        value={data.name}
                        placeholder="Enter Bank Name"
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="address"
                        value={data.address}
                        placeholder="Enter Bank address"
                        onChange={(e) => setData("address", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="contact_number"
                        value={data.contact_number}
                        placeholder="Enter Bank contact_number"
                        onChange={(e) =>
                            setData("contact_number", e.target.value)
                        }
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="email"
                        value={data.email}
                        placeholder="Enter Bank email"
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        className="px-6 py-3 mt-4 text-lg font-semibold text-white bg-green-700 rounded-lg shadow hover:bg-green-800 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-200"
                        type="submit"
                    >
                        Create Bank
                    </button>
                </form>
            </div>
        </main>
    );
}

// CreateBank.layout = (page) => <Layout children={page} />;
