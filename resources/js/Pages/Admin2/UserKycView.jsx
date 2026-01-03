import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function UserKycView({ user }) {
    const approveUser = () => {
        if (!confirm("Approve this user?")) return;
        router.post(route("bank.users.approve", user.user_id));
    };

    const rejectUser = () => {
        if (!confirm("Reject this user?")) return;
        router.post(route("bank.users.reject", user.user_id));
    };

    const DocCard = ({ title, file }) => (
        <div className="card p-4 space-y-3">
            <h4 className="font-semibold">{title}</h4>

            {file ? (
                <a
                    href={`/storage/kyc/${file}`}
                    target="_blank"
                    className="group block relative overflow-hidden rounded-xl border"
                >
                    <img
                        src={`/storage/kyc/${file}`}
                        alt={title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        View
                    </span>
                </a>
            ) : (
                <p className="text-sm text-muted">Not uploaded</p>
            )}
        </div>
    );

    return (
        <>
            <Head title="User KYC Review" />

            <main className="page space-y-8">
                {/* ================= HEADER ================= */}
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">KYC Review</h1>
                        <p className="text-sm text-muted">
                            Review submitted identity documents
                        </p>
                    </div>
                    <span
                        className={`badge px-2 py-1 rounded-full text-sm font-semibold ${
                            user.status === "active"
                                ? "bg-[var(--color-success)] text-white"
                                : user.status === "inactive"
                                ? "bg-[var(--color-danger)] text-white"
                                : user.status === "pending"
                                ? "bg-[var(--color-warning)] text-white"
                                : "bg-[var(--color-muted)] text-white"
                        }`} 
                    >
                        {user.status}
                    </span>
                </div>

                {/* ================= USER INFO ================= */}
                <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile */}
                    <div className="flex items-center gap-4">
                        <img
                            src={
                                user.profile_photo
                                    ? `/storage/kyc/${user.profile_photo}`
                                    : "/storage/profile_photos/default-avatar.png"
                            }
                            className="w-20 h-20 rounded-full object-cover border"
                        />
                        <div>
                            <h3 className="font-semibold">{user.full_name}</h3>
                            <p className="text-sm text-muted">
                                @{user.username}
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 text-sm">
                        <p>
                            <b>Email:</b> {user.email}
                        </p>
                        <p>
                            <b>Phone:</b> {user.phone_number}
                        </p>
                        <p>
                            <b>Branch:</b> {user.branch?.name}
                        </p>
                        <p>
                            <b>Bank:</b> {user.bank?.name}
                        </p>
                    </div>

                    {/* Meta */}
                    <div className="space-y-1 text-sm">
                        <p>
                            <b>Registered:</b>{" "}
                            {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <p>
                            <b>User ID:</b> #{user.user_id}
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Identity Documents
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DocCard
                            title="Passport Photo"
                            file={user.passport_photo}
                        />
                        <DocCard
                            title="ID Card (Front)"
                            file={user.id_card_front}
                        />
                        <DocCard
                            title="ID Card (Back)"
                            file={user.id_card_back}
                        />
                        <DocCard
                            title="Proof of Address"
                            file={user.proof_of_address}
                        />
                    </div>
                </div>

                {/* ================= ACTIONS ================= */}
                <div className="card p-6 flex flex-col sm:flex-row gap-4 justify-end">
                    <button onClick={rejectUser} className="btn btn-danger">
                        <Icon name="x" className="w-4 h-4" />
                        Reject User
                    </button>

                    <button onClick={approveUser} className="btn btn-success">
                        <Icon name="check" className="w-4 h-4" />
                        Approve User
                    </button>
                </div>
            </main>
        </>
    );
}

UserKycView.layout = (page) => <AdminLayout>{page}</AdminLayout>;
