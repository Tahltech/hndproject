import { useForm } from "@inertiajs/react";

export default function LoanApplication() {
    const { data, setData, post, processing, errors } = useForm({
        amount: "",
        loan_purpose: "",
        repayment_period: "",
        id_number: "",
        address: "",
        g_full_name: "",
        g_email: "",
        g_phone: "",
        g_id_number: "",
        g_address: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("loan.apply"));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">

            <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Loan Application Form
                </h2>

                <h3 className="text-xl font-bold mb-4 text-gray-700">
                    Loan Applicant Information
                </h3>

                <form onSubmit={submit} className="space-y-6">

                  
                    <div className="flex flex-col md:flex-row gap-4">
                        
                        {/* Loan Amount */}
                        <div className="flex-1">
                            <label className="block mb-1 font-medium text-gray-700">
                                Loan Amount (FCFA)
                            </label>
                            <input
                                type="number"
                                className="w-full border rounded-lg px-3 py-2"
                                value={data.amount}
                                onChange={(e) => setData("amount", e.target.value)}
                            />
                        </div>

                        {/* Repayment Period */}
                        <div className="flex-1">
                            <label className="block mb-1 font-medium text-gray-700">
                                Repayment Period
                            </label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={data.repayment_period}
                                onChange={(e) => setData("repayment_period", e.target.value)}
                            >
                                <option value="">Select Period</option>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12">12 Months</option>
                                <option value="18">18 Months</option>
                                <option value="24">24 Months</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: ID + Address */}
                    <div className="flex flex-col md:flex-row gap-4">
                        
                        {/* ID */}
                        <div className="flex-1">
                            <label className="block mb-1 font-medium text-gray-700">
                                National ID / Passport Number
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={data.id_number}
                                onChange={(e) => setData("id_number", e.target.value)}
                            />
                        </div>

                        {/* Address */}
                        <div className="flex-1">
                            <label className="block mb-1 font-medium text-gray-700">
                                Residential Address
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Loan Purpose (full width) */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">
                            Purpose of Loan
                        </label>
                        <textarea
                            className="w-full border rounded-lg px-3 py-2"
                            rows="3"
                            value={data.loan_purpose}
                            onChange={(e) => setData("loan_purpose", e.target.value)}
                        ></textarea>
                    </div>

                    {/* Guarantor Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-700">
                            Guarantor Information
                        </h3>

                        {/* Row 1: Full Name + Email */}
                        <div className="flex flex-col md:flex-row gap-4">
                            
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={data.g_full_name}
                                    onChange={(e) =>
                                        setData("g_full_name", e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={data.g_email}
                                    onChange={(e) =>
                                        setData("g_email", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        
                        <div className="flex flex-col md:flex-row gap-4 mt-4">

                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={data.g_phone}
                                    onChange={(e) =>
                                        setData("g_phone", e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-gray-700">
                                    National ID / Passport Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={data.g_id_number}
                                    onChange={(e) =>
                                        setData("g_id_number", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Row 3: Address */}
                        <div className="mt-4">
                            <label className="block mb-1 font-medium text-gray-700">
                                Residential Address
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={data.g_address}
                                onChange={(e) =>
                                    setData("g_address", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-6"
                    >
                        {processing ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}
