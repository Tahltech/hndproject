import Layout from "./Layout/Layout";
import { Link, Head } from "@inertiajs/react";
import React from "react";
import { route } from "ziggy-js";

export default function Home() {
    return (
        <main>
            <Head  title="Home" />
           
            <h1>hello welcome to our site </h1>
            <p>Login or create account to continue</p>

            <div className="buttons text-">
                <div className="button">
                    <Link href={route('login')}  className="underline font-bold size-2.5">Login</Link>
                </div>

                <div className="button">
                    <Link href={route('signup')} className="underline font-bold ">Signup</Link>
                </div>
            </div>
        </main>
    );
}

Home.layout = (page) => <Layout>{page}</Layout>;
