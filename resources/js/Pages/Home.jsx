import Layout from "./Layout/Layout";
import { Link, Head } from "@inertiajs/react";
import React from "react";
import { route } from "ziggy-js";
import AlertMessage from "../Components/AlertMessage";

export default function Home({ banks }) {
    return (
        <main>
            <Head title="Home" />

            <AlertMessage />

            <h1>hello welcome to our site </h1>
            <p>Login or create account to continue</p>

            <div className="buttons text-">
                <div className="button">
                    <Link
                        href={route("login")}
                        className="underline font-bold size-2.5"
                    >
                        Login
                    </Link>
                </div>

                <div className="button">
                    <Link
                        href={route("signup")}
                        className="underline font-bold "
                    >
                        Signup
                    </Link>
                </div>
            </div>

            <div className="w-full p-4">
                <h1 className="text-2xl font-bold mb-3">Available Banks</h1>
               <p className="italic text-gray-500 text-sm mb-2">
                    Click any of the links below to create an account under the Bank</p>


                <div className="space-y-3">
                    {(banks?.data ?? banks)?.map((bank) => (
                        <Link
                            key={bank.bank_id}
                        
                            href={route('branches', bank.bank_id)}
                            className="block bg-blue-600  text-white font-semibold  p-4  rounded-xl shadow hover:scale-[1.03] active:animate-wiggle transition-all duration-200"
                        >
                            {bank.name}
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}

Home.layout = (page) => <Layout>{page}</Layout>;
