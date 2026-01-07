import { useForm } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";

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
        g_id_front: null,
        g_id_back: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("loan.apply"));
    };

    return (
        <div className="min-h-screen bg-[var(--color-primary-light)] py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-[var(--color-background)] shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
                
                <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)] text-center">
                    Loan Application Form
                </h2>

                <p className="text-sm text-[var(--color-text-secondary)] mb-6 text-center">
                    Before applying, make sure your KYC information is up-to-date. 
                    Guarantor information is required for loan approval.
                </p>

                <form onSubmit={submit} className="space-y-6">

                    {/* ================= Loan Applicant Info ================= */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                            Applicant Information
                        </h3>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">
                                    Loan Amount (FCFA)
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    value={data.amount}
                                    onChange={(e) => setData("amount", e.target.value)}
                                />
                                {errors.amount && <p className="text-danger text-sm mt-1">{errors.amount}</p>}
                            </div>

                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">
                                    Repayment Period
                                </label>
                                <select
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
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
                                {errors.repayment_period && <p className="text-danger text-sm mt-1">{errors.repayment_period}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">
                                    National ID / Passport Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    value={data.id_number}
                                    onChange={(e) => setData("id_number", e.target.value)}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">
                                    Residential Address
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-[var(--color-text-primary)]">
                                Purpose of Loan
                            </label>
                            <textarea
                                rows="3"
                                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                value={data.loan_purpose}
                                onChange={(e) => setData("loan_purpose", e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* ================= Guarantor Info ================= */}
                    <div className="space-y-4 pt-6">
                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                            Guarantor Information
                        </h3>

                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                            Guarantor must provide accurate information and valid ID (front & back) for loan approval.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    value={data.g_full_name}
                                    onChange={(e) => setData("g_full_name", e.target.value)}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">Email</label>
                                <input
                                    type="email"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    value={data.g_email}
                                    onChange={(e) => setData("g_email", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    value={data.g_phone}
                                    onChange={(e) => setData("g_phone", e.target.value)}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">National ID / Passport Number</label>
                                <input
                                    type="text"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    value={data.g_id_number}
                                    onChange={(e) => setData("g_id_number", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-[var(--color-text-primary)]">Residential Address</label>
                            <input
                                type="text"
                                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                value={data.g_address}
                                onChange={(e) => setData("g_address", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">Guarantor ID Front</label>
                                <input
                                    type="file"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2"
                                    onChange={(e) => setData("g_id_front", e.target.files[0])}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-[var(--color-text-primary)]">Guarantor ID Back</label>
                                <input
                                    type="file"
                                    className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2"
                                    onChange={(e) => setData("g_id_back", e.target.files[0])}
                                />
                            </div>
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full btn btn-primary text-white font-bold py-3 rounded-lg mt-6"
                    >
                        {processing ? "Submitting..." : "Submit Application"}
                    </button>

                </form>
            </div>
        </div>
    );
}

LoanApplication.layout = (page) => <AppLayout>{page}</AppLayout>;
