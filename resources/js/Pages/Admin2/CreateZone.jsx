import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "../Layout/AdminLayout";

export default function CreateZone() {
    const { data, setData, post, processing } = useForm({
        zoneName: "",
    });

    const submitZone = (e) => {
        e.preventDefault();
        post(route("savezone"));
    };

    return (
        <main className="page">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    Create Zone
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Enter the details to create a new zone for your branch.
                </p>
            </div>

            {/* Form Card */}
            <div className="card max-w-md mx-auto p-6">
                <form onSubmit={submitZone} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-[var(--color-text-muted)]">
                            Zone Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Zone Name"
                            value={data.zoneName}
                            onChange={(e) => setData("zoneName", e.target.value)}
                            className="input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary mt-2"
                    >
                        {processing ? "Creating..." : "Create Zone"}
                    </button>
                </form>
            </div>
        </main>
    );
}

CreateZone.layout = (page) => <AdminLayout>{page}</AdminLayout>;
