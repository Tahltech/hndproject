import { route } from "ziggy-js";
import { Link, useForm, usePage, Head } from "@inertiajs/react";
import AdminLayout from "@/Pages/Layout/AdminLayout";
import Icon from "@/Components/Icons";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function LoanAdminDashboard({ loanStats, monthlyStats }) {
    const { props } = usePage();
    const user = props.auth?.user;

    return (
        <main className="page space-y-6">
            <div className="flex justify-end items-center gap-4">
                <Head  title="Loan Admin Dashboard " />
                {/* Bank Logo + Name */}
                <div className="flex flex-col items-center cursor-pointer group">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-primary-light)] flex items-center justify-center group-hover:ring-2 group-hover:ring-[var(--color-primary)] transition">
                        <img
                            src={
                                user?.bank?.bank_profile
                                    ? `/storage/bank_logos/${user.bank?.bank_profile}`
                                    : "/storage/profile_photos/default-avatar.png"
                            }
                            alt={user?.bank?.bank_name || "Bank Logo"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-xs font-semibold mt-1">
                        {user?.bank?.bank_name || "Bank Name"}
                    </p>
                </div>

                {/* View Branch Staff Button */}
                <Link
                    href={route("showrequests")}
                    className="btn btn-sm btn-primary flex items-center gap-2 px-3 h-8"
                >
                    <Icon name="bell" className="w-4 h-4" />
                    <span className="text-xs font-semibold">
                        View Loan Requests
                    </span>
                </Link>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                Welcome Loan Admin
            </h2>

            {/* Loan Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Total Loan Amount */}
                <div className="card flex flex-col items-center p-6 border-l-4 border-[var(--color-primary)]">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                        Total Loan Amount
                    </span>
                    <span className="text-2xl font-bold text-[var(--color-primary)] mt-2">
                        XAF {loanStats.totalLoan || 0}
                    </span>
                </div>

                {/* Pending Loans */}
                <div className="card flex flex-col items-center p-6 bg-[var(--color-warning-light)] text-[var(--color-warning)] border-l-4 border-[var(--color-warning)]">
                    <span className="text-sm font-medium">Pending Loans</span>
                    <span className="text-2xl font-bold mt-2">
                        {loanStats.pending || 0}
                    </span>
                </div>

                {/* Approved Loans */}
                <div className="card flex flex-col items-center p-6 bg-[var(--color-success-light)] text-[var(--color-success)] border-l-4 border-[var(--color-success)]">
                    <span className="text-sm font-medium">Approved Loans</span>
                    <span className="text-2xl font-bold mt-2">
                        {loanStats.approved || 0}
                    </span>
                </div>
            </div>

            {/* Total Approved Amount */}
            <div className="card flex flex-col items-center p-6 bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]">
                <span className="text-sm font-medium">
                    Total Loan Amount Approved
                </span>
                <span className="text-2xl font-bold mt-2">
                    XAF {loanStats.totalApproved || 0}
                </span>
            </div>

            {/* Chart */}
            <div className="card p-6 mt-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                    Monthly Loan Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="total"
                            fill="var(--color-primary)"
                            name="Total Loans"
                        />
                        <Bar
                            dataKey="approved"
                            fill="var(--color-success)"
                            name="Approved"
                        />
                        <Bar
                            dataKey="pending"
                            fill="var(--color-warning)"
                            name="Pending"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Links */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                <Link
                    href={route("availableusers")}
                    className="btn btn-primary px-6 py-2 rounded shadow hover:opacity-90"
                >
                    Available Users
                </Link>
            </div>
        </main>
    );
}

LoanAdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
