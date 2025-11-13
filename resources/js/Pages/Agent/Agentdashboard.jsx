import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function () {
    const {post}= useForm();
    const submit = (e)=>{
        e.preventDefault();
        post(route("logout"));
    }
    return (
        <>
            <h2 
            className="mb-19">Welcome Agent Dashboard</h2>
            
        
        <form>
            
        </form>

            <form onSubmit={submit}>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-3"
                >
                    Logout
                </button>
            </form>
        </>
    );
}
