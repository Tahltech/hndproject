import AdminLayout from "@/Pages/Layout/AdminLayout";
import StatCard from "../../Components/StatCard";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Icon from "@/Components/Icons";
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function AccountantDashboard({ stats }) {
    const netBalance = (stats.totalIn || 0) - (stats.totalOut || 0);
    const { props } = usePage();
    const user = props.auth?.user;

    const pieData = [
        { name: "Money In", value: stats.totalIn || 0 },
        { name: "Money Out", value: stats.totalOut || 0 },
    ];
    const pieColors = ["#22c55e", "#ef4444"];

    // Cash vs MoMo deposits
    const channelData = [
        { name: "Cash", value: stats.cashIn || 0 },
        { name: "MoMo", value: stats.momoIn || 0 },
    ];
    const channelColors = ["#3b82f6", "#f97316"]; // blue for cash, orange for MoMo

    //  Weekly Transactions
    const weeklyData = stats.weeklyTransactions || [
        { day: "Mon", in: 0, out: 0 },
        { day: "Tue", in: 0, out: 0 },
        { day: "Wed", in: 0, out: 0 },
        { day: "Thu", in: 0, out: 0 },
        { day: "Fri", in: 0, out: 0 },
        { day: "Sat", in: 0, out: 0 },
        { day: "Sun", in: 0, out: 0 },
    ];

    return (
        <>
            <Head title="Accountant Dashboard" />

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

                    {/* View Branch Staff Button */}
                    <Link
                        href={route("branchStaff")}
                        className="btn btn-sm btn-primary flex items-center gap-2 px-3 h-8"
                    >
                        <Icon name="users" className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                            View Staff
                        </span>
                    </Link>
                </div>

                {/* TOP KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Money In"
                        value={`XAF ${stats.totalIn}`}
                        variant="success"
                    />
                    <StatCard
                        title="Total Money Out"
                        value={`XAF ${stats.totalOut}`}
                        variant="danger"
                    />
                    <StatCard
                        title="Net Balance"
                        value={`XAF ${netBalance}`}
                        variant={netBalance >= 0 ? "success" : "danger"}
                    />
                </div>

                {/* SECOND ROW: Channels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Cash In" value={`XAF ${stats.cashIn}`} />
                    <StatCard title="MoMo In" value={`XAF ${stats.momoIn}`} />
                </div>

                {/* THIRD ROW: Loans & Today's Transactions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                        title="Loan Disbursed"
                        value={`XAF ${stats.loanDisbursed}`}
                        variant="warning"
                    />
                    <StatCard
                        title="Today's Transactions"
                        value={`In: XAF ${stats.todayIn} | Out: XAF ${stats.todayOut}`}
                    />
                </div>

                {/* CHARTS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pie Chart: Money In vs Out */}
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-semibold mb-4">Money In vs Out</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                pieColors[
                                                    index % pieColors.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart: Cash vs MoMo */}
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-semibold mb-4">
                            Cash vs MoMo Deposits
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={channelData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {channelData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                channelColors[
                                                    index % channelColors.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Line Chart: Weekly Transactions */}
                    <div className="bg-white p-4 rounded shadow md:col-span-2">
                        <h2 className="font-semibold mb-4">
                            Weekly Transactions
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="in"
                                    stroke="#22c55e"
                                    name="In"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="out"
                                    stroke="#ef4444"
                                    name="Out"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end mt-6">
                    <Link
                        href={route("accountant.transactions")}
                        className="btn btn-primary px-6 py-2 rounded"
                    >
                        View All Transactions
                    </Link>
                </div>
            </main>
        </>
    );
}

AccountantDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
