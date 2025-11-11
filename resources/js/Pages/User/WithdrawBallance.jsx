import React, {useState, useEffect} from "react";
import { useForm, Head, usePage, } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function WithdrawBallance() {
    const { flash } = usePage().props;
    const [message, setMessage] = useState(flash.success || flash.error);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const { data, post, setData } = useForm({
        method: "",
        mobileNumber: "",
        amount: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("withdrawballance"), data);
    };

    return (
        <>
            <Head title="Withdraw Ballance" />
            <h1 className="text-2xl font-bold mb-4">Withdraw Savings</h1>

            <form
                className="flex flex-col gap-4 p-4 bg-green-100 rounded-xl"
                onSubmit={submit}
            >
                <label htmlFor="method">Method</label>
                <select
                    id="method"
                    value={data.method}
                    onChange={(e) => setData("method", e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Payment Method</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Orange Money">Orange Money</option>
                </select>
                <label htmlFor="mobileNumber" className="block">
                    Mobile Number
                </label>
                <div className="flex items-center border rounded overflow-hidden">
                    <span className="px-3 bg-gray-200 text-gray-700 select-none h-full">
                        +237
                    </span>
                    <input
                        type="number"
                        id="mobileNumber"
                        value={data.mobileNumber}
                        placeholder="6XXXXXXXX"
                        onChange={(e) =>
                            setData("mobileNumber", e.target.value)
                        }
                        className="p-2 flex-1 outline-none"
                    />
                </div>

                <label htmlFor="amount">Amount (XAF)</label>
                <input
                    type="text"
                    id="amount"
                    value={data.amount}
                    placeholder="Enter amount in XAF"
                    onChange={(e) => setData("amount", e.target.value)}
                    className="p-2 border rounded"
                />

                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Withdraw Ballance
                </button>
            </form>

            <div>
                {flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {flash.error}
                    </div>
                )}
            </div>
        </>
    );
}
