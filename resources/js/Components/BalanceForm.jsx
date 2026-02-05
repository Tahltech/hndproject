import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function BalanceForm({ type }) {
    const { post, data, setData, processing } = useForm({
        method: "",
        mobileNumber: "",
        amount: "",
        type, // "credit" or "debit"
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("newballance"), { preserveScroll: true });
    };

    return (
        <form
            onSubmit={submit}
            className="card p-6 md:p-8 rounded-2xl shadow-md max-w-md mx-auto mt-14 flex flex-col gap-5"
        >
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                {type === "credit" ? "Add Balance" : "Withdraw Balance"}
            </h2>

            {/* Payment Method */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-[var(--color-text-secondary)]">
                    Method
                </label>
                <select
                    value={data.method}
                    onChange={(e) => setData("method", e.target.value)}
                    className="input h-10"
                >
                    <option value="">Choose Payment Method</option>
                    <option value="MobileMoney">Mobile Money</option>
                    <option value="OrangeMoney">Orange Money</option>
                </select>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-[var(--color-text-secondary)]">
                    Mobile Number
                </label>

                <div className="flex items-center border rounded input h-10 overflow-hidden">
                    {/* Prefix */}
                    <span className="px-3 bg-transparent text-[var(--color-text-primary)] flex items-center justify-center h-full">
                        +237
                    </span>

                    {/* Input */}
                    <input
                        type="tel"
                        placeholder="6XXXXXXXX"
                        value={data.mobileNumber}
                        onChange={(e) => setData("mobileNumber", e.target.value)}
                        className="flex-1 h-full p-2 outline-none"
                    />
                </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-[var(--color-text-secondary)]">
                    Amount (XAF)
                </label>
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={data.amount}
                    onChange={(e) => setData("amount", e.target.value)}
                    className="input h-10"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={processing}
                className={`btn ${type === "credit" ? "btn-success" : "btn-danger"} w-full mt-3 h-10`}
            >
                {processing
                    ? "Processing..."
                    : type === "credit"
                    ? "Add Balance"
                    : "Withdraw"}
            </button>
        </form>
    );
}
