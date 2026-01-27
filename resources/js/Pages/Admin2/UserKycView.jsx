import React, { useState } from "react";
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

    const DocCard = ({ title, file }) => {
        const [isOpen, setIsOpen] = useState(false);
        const fileUrl = file ? `/storage/kyc/${file}` : null;

        if (!file) {
            return (
                <div className="card p-4 space-y-3">
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-sm text-muted">Not uploaded</p>
                </div>
            );
        }

        return (
            <>
                <div
                    className="card p-4 space-y-3 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <h4 className="font-semibold">{title}</h4>
                    <img
                        src={fileUrl}
                        alt={title}
                        className="w-full h-48 object-cover rounded-xl border transition hover:scale-105"
                    />
                    <span className="text-sm text-gray-500 mt-1 block">
                        Click to preview
                    </span>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
                            {/* Close button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
                            >
                                ×
                            </button>

                            <h4 className="mb-4 font-semibold">{title}</h4>

                            <img
                                src={fileUrl}
                                alt={title}
                                className="w-full h-auto max-h-[80vh] object-contain rounded"
                            />
                        </div>
                    </div>
                )}
            </>
        );
    };

    const kycStatus = user.kyc?.status ?? "not submitted";
    const badgeColor =
        kycStatus === "pending"
            ? "bg-[var(--color-warning)] text-white"
            : kycStatus === "approved"
            ? "bg-[var(--color-success)] text-white"
            : kycStatus === "rejected"
            ? "bg-[var(--color-danger)] text-white"
            : "bg-[var(--color-muted)] text-white";

    return (
        <>
            <Head title="User KYC Review" />

            <main className="page space-y-8">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">KYC Review</h1>
                        <p className="text-sm text-muted">
                            Review submitted identity documents
                        </p>
                    </div>
                    <span
                        className={`badge px-2 py-1 rounded-full text-sm font-semibold ${badgeColor}`}
                    >
                        {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                    </span>
                </div>

                <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile */}
                    <div className="flex items-center gap-4">
                        <img
                            src={
                                user.profile_photo
                                    ? `/storage/profile_photos/${user.profile_photo}`
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
                            file={user.kyc?.passport_photo}
                        />
                        <DocCard
                            title="ID Card (Front)"
                            file={user.kyc?.id_card_front}
                        />
                        <DocCard
                            title="ID Card (Back)"
                            file={user.kyc?.id_card_back}
                        />
                        <DocCard
                            title="Proof of Address"
                            file={user.kyc?.proof_of_address}
                        />
                    </div>
                </div>

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
