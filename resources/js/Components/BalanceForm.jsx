import React from "react";
import { useForm, usePage } from "@inertiajs/react";
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
        <form onSubmit={submit} className="flex flex-col gap-4 mt-14">
            <h2 className="text-xl font-bold mb-2">
                {type === "credit" ? "Add Balance" : "Withdraw Balance"}
            </h2>

            <label className="font-medium">Method</label>
            <select
                value={data.method}
                onChange={(e) => setData("method", e.target.value)}
                className="p-2 border rounded bg-white"
            >
                <option value="">Choose Payment Method</option>
                <option value="MobileMoney">Mobile Money</option>
                <option value="OrangeMoney">Orange Money</option>
            </select>

            <label className="font-medium">Mobile Number</label>
            <div className="flex border rounded overflow-hidden">
                <span className="px-3 bg-gray-200 text-gray-700">+237</span>
                <input
                    type="number"
                    placeholder="6XXXXXXXX"
                    value={data.mobileNumber}
                    onChange={(e) => setData("mobileNumber", e.target.value)}
                    className="p-2 flex-1 outline-none"
                />
            </div>

            <label className="font-medium">Amount (XAF)</label>
            <input
                type="number"
                placeholder="Enter amount"
                value={data.amount}
                onChange={(e) => setData("amount", e.target.value)}
                className="p-2 border rounded"
            />

            <button
                type="submit"
                disabled={processing}
                className={`py-2 rounded text-white transition ${
                    type === "credit"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                }`}
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
