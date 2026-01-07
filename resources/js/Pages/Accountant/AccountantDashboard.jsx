import React from "react";
import AdminLayout from "@/Pages/Layout/AdminLayout";
import { usePage, Head, Link } from "@inertiajs/react";
import Icon from "@/Components/Icons";
import StatCard from "./StatsCard";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

export default function AccountantDashboard({
    stats = {},
    monthlyRepayments = [],
    loanStatusStats = [],
}) {
    const { props } = usePage();
    const user = props.auth?.user;
    return (
        <main className="page space-y-6">
            {/* ===== Top Right Bar ===== */}
            <Head title="Accountant Dashboard" />
            <div className="flex justify-end items-center gap-4">
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

                {/* view Branch Staff Button */}
                <Link
                    href={route("branchStaff")}
                    className="btn btn-sm btn-primary flex items-center gap-2 px-3 h-8"
                >
                    <Icon name="users" className="w-4 h-4" />
                    <span className="text-xs font-semibold">View Staff</span>
                </Link>
            </div>
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">
                    Accountant Dashboard
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Financial overview & repayment monitoring
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <StatCard
                    title="Total Loans Disbursed"
                    value={`XAF ${stats.totalDisbursed || 0}`}
                    size="lg"
                    highlight
                />

                <StatCard
                    title="Total Repaid"
                    value={`XAF ${stats.totalRepaid || 0}`}
                    variant="success"
                />
                <StatCard
                    title="Outstanding Balance"
                    value={`XAF ${stats.outstanding || 0}`}
                    variant="warning"
                />
                <StatCard
                    title="Overdue Amount"
                    value={`XAF ${stats.overdue || 0}`}
                    variant="danger"
                />
                <StatCard
                    title="Interest Earned"
                    value={`XAF ${stats.interest || 0}`}
                />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Repayments */}
                <div className="card p-6 lg:col-span-2">
                    <h3 className="font-semibold mb-4">Monthly Repayments</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={monthlyRepayments}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="var(--color-primary)"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Loan Status */}
                <div className="card p-6">
                    <h3 className="font-semibold mb-4">
                        Loan Status Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={loanStatusStats}
                                dataKey="value"
                                nameKey="status"
                                innerRadius={60}
                                outerRadius={100}
                            >
                                {loanStatusStats.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            [
                                                "var(--color-warning)",
                                                "var(--color-success)",
                                                "var(--color-danger)",
                                            ][index % 3]
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* QUICK SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    label="Active Loans"
                    value={stats.activeLoans || 0}
                />
                <SummaryCard
                    label="Loans Fully Paid"
                    value={stats.completedLoans || 0}
                />
                <SummaryCard
                    label="Defaulted Loans"
                    value={stats.defaultedLoans || 0}
                    variant="danger"
                />
            </div>
        </main>
    );
}

AccountantDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;

// function StatCard({ title, value, variant }) {
//     const variants = {
//         success: "bg-[var(--color-success-light)] text-[var(--color-success)]",
//         warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
//         danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
//     };

//     return (
//         <div className={`card p-6 text-center ${variants[variant] || ""}`}>
//             <p className="text-sm font-medium">{title}</p>
//             <p className="text-2xl font-extrabold mt-2">{value}</p>
//         </div>
//     );
// }

function SummaryCard({ label, value, variant }) {
    const variants = {
        danger: "text-[var(--color-danger)]",
    };

    return (
        <div className="card p-6 text-center">
            <p className="text-sm">{label}</p>
            <p
                className={`text-2xl font-bold mt-2 ${
                    variants[variant] || "text-[var(--color-primary)]"
                }`}
            >
                {value}
            </p>
        </div>
    );
}
