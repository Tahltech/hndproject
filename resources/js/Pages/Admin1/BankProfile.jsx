import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";
import { data } from "autoprefixer";

export default function BankProfile({ bank }) {
    const [activeTab, setActiveTab] = useState("general");

    const {
        data: generalData,
        setData: setGeneralData,
        patch: updateGeneral,
        processing: processingGeneral,
    } = useForm({
        name: bank.name || "",
        email: bank.email || "",
    });

    const {
        data: contactData,
        setData: setContactData,
        patch: updateContact,
        processing: processingContact,
    } = useForm({
        address: bank.address || "",
        phone: bank.contact_number || "",
    });

    const {
        data: brandingData,
        setData: setBrandingData,
        post: updateBranding,
        processing: processingBranding,
    } = useForm({
        quote: "",
        profile_photo: null,
    });

    const {
        data: settingsData,
        setData: setSettingsData,
        patch: updateSettings,
        processing: processingSettings,
    } = useForm({
        status: bank.status || "active",
    });
    return (
        <main className="page space-y-6">
            <Head title="Bank Profile" />

            <h1 className="text-2xl font-bold text-center md:text-left">
                Bank Profile
            </h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)]">
                {["general", "branding", "contact", "settings"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-bold rounded-t-md transition ${
                            activeTab === tab
                                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                                : "text-muted hover:text-[var(--color-text-primary)]"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto space-y-6">
                {/* GENERAL */}
                {activeTab === "general" && (
                    <div className="card bg-[var(--color-primary)] text-white text-center space-y-6">
                        <h2 className="text-lg font-semibold">
                            General Information
                        </h2>

                        {/* Profile Photo + Quote */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                                <img
                                    src={
                                        bank?.profile_photo
                                            ? `/storage/bank_logos/${bank.profile_photo}`
                                            : "/storage/profile_photos/default-avatar.png"
                                    }
                                    alt="Bank Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Bank Quote */}
                            {bank?.quotes && (
                                <p className="text-sm text-muted text-center max-w-xs">
                                    “{bank.quotes}”
                                </p>
                            )}
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateGeneral(route("bank.profile.general"));
                            }}
                            className="space-y-4 w-full"
                        >
                            <input
                                type="text"
                                placeholder="Bank Name"
                                value={generalData.name}
                                onChange={(e) =>
                                    setGeneralData("name", e.target.value)
                                }
                                className="input w-full bg-white text-gray-800 border border-gray-200 focus:border-primary focus:ring-primary"
                            />

                            <input
                                type="email"
                                placeholder="Bank Email"
                                value={generalData.email}
                                onChange={(e) =>
                                    setGeneralData("email", e.target.value)
                                }
                                className="input w-full bg-white text-gray-800 border border-gray-200 focus:border-primary focus:ring-primary"
                            />

                            <button
                                type="submit"
                                disabled={processingGeneral}
                                className="btn btn-primary w-full"
                            >
                                {processingGeneral
                                    ? "Updating..."
                                    : "Update General Info"}
                            </button>
                        </form>
                    </div>
                )}

                {/* BRANDING */}
                {activeTab === "branding" && (
                    <div className="card space-y-4">
                        <h2 className="text-lg font-semibold">Branding</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateBranding(route("bank.profile.branding"), {
                                    forceFormData: true,
                                });
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setBrandingData(
                                        "profile_photo",
                                        e.target.files[0]
                                    )
                                }
                                className="input w-full"
                            />

                            <input
                                type="text"
                                value={brandingData.quote}
                                onChange={(e) =>
                                    setBrandingData("quote", e.target.value)
                                }
                                placeholder="enter the banks quote"
                                className="input"
                            />

                            <button
                                type="submit"
                                disabled={processingBranding}
                                className="btn btn-primary w-full"
                            >
                                {processingBranding
                                    ? "Updating..."
                                    : "Update Branding"}
                            </button>
                        </form>
                    </div>
                )}

                {/* CONTACT */}
                {activeTab === "contact" && (
                    <div className="card space-y-4">
                        <h2 className="text-lg font-semibold">
                            Contact Information
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateContact(route("bank.profile.contact"));
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="text"
                                placeholder="Address"
                                value={contactData.address}
                                onChange={(e) =>
                                    setContactData("address", e.target.value)
                                }
                                className="input"
                            />

                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={contactData.phone}
                                onChange={(e) =>
                                    setContactData("phone", e.target.value)
                                }
                                className="input"
                            />

                            <button
                                type="submit"
                                disabled={processingContact}
                                className="btn btn-primary w-full"
                            >
                                {processingContact
                                    ? "Updating..."
                                    : "Update Contact"}
                            </button>
                        </form>
                    </div>
                )}

                {/* SETTINGS */}
                {activeTab === "settings" && (
                    <div className="card space-y-4">
                        <h2 className="text-lg font-semibold">Settings</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateSettings(route("bank.profile.settings"));
                            }}
                            className="space-y-4"
                        >
                            <select
                                value={settingsData.status}
                                onChange={(e) =>
                                    setSettingsData("status", e.target.value)
                                }
                                className="input"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <button
                                type="submit"
                                disabled={processingSettings}
                                className="btn btn-primary w-full"
                            >
                                {processingSettings
                                    ? "Updating..."
                                    : "Update Settings"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}

BankProfile.layout = (page) => <AdminLayout>{page}</AdminLayout>;
