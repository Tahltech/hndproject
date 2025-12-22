import React from "react";
import { useForm } from "@inertiajs/react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../Utils/CropImage";
import { route } from "ziggy-js";
import { useState } from "react";
import AppLayout from "../Layout/AppLayout";
//import AuthLayout from "../Layouts/AuthLayout";
import AdminLayout from "../Layout/AdminLayout";

export default function SettingsPage({ authUser }) {
    const [showCropper, setShowCropper] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const profileForm = useForm({
        full_name: authUser?.full_name || "",
        username: authUser?.username || "",
        email: authUser?.email || "",
        phone_number: authUser?.phone_number || "",
        profile_photo: null,
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post(route("updateprofile"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    /* ================= NOTIFICATIONS ================= */
    const notificationsForm = useForm({
        transactionAlerts: true,
        promotionalEmails: false,
        pushNotifications: true,
    });

    const submitNotifications = (e) => {
        e.preventDefault();
        notificationsForm.post("/settings/notifications", {
            preserveScroll: true,
        });
    };

    /* ================= PREFERENCES ================= */
    const preferencesForm = useForm({
        language: "English",
        darkMode: false,
    });

    const submitPreferences = (e) => {
        e.preventDefault();
        preferencesForm.post("/settings/preferences", {
            preserveScroll: true,
        });
    };
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.post("/settings/password", {
            preserveScroll: true,
            onSuccess: () =>
                passwordForm.reset(
                    "current_password",
                    "password",
                    "password_confirmation"
                ),
        });
    };

    const avatarSrc = profileForm.data.profile_photo
        ? URL.createObjectURL(profileForm.data.profile_photo)
        : authUser?.profile_photo
        ? `/storage/profile_photos/${authUser.profile_photo}`
        : `/storage/profile_photos/default-avatar.png`;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <div className="flex items-center space-x-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="relative group">
                    <img
                        src={avatarSrc}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-2 border-[#3D37FF]"
                    />

                    <span
                        className={`absolute top-1 right-1 h-4 w-4 rounded-full border-2 border-white ${
                            authUser?.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                        }`}
                    />

                    {/* Upload overlay */}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const reader = new FileReader();
                                reader.onload = () => {
                                    setImageSrc(reader.result);
                                    setShowCropper(true);
                                };
                                reader.readAsDataURL(file);
                            }}
                        />
                    </label>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {authUser?.full_name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-md font-semibold uppercase">
                            Role: {authUser?.role?.role_name}
                        </span>
                        <span className="text-gray-400 text-sm">
                            @{authUser?.username}
                        </span>
                    </div>
                </div>
            </div>

            {/* ================= ACCOUNT INFO ================= */}
            <form
                onSubmit={submitProfile}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4"
            >
                <h3 className="text-lg font-semibold text-gray-700">
                    Account Information
                </h3>

                {["full_name", "username", "email", "phone_number"].map(
                    (field) => (
                        <div key={field} className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">
                                {field.replace("_", " ").toUpperCase()}
                            </label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                value={profileForm.data[field]}
                                onChange={(e) =>
                                    profileForm.setData(field, e.target.value)
                                }
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#3D37FF] focus:outline-none"
                            />
                            {profileForm.errors[field] && (
                                <span className="text-red-500 text-sm">
                                    {profileForm.errors[field]}
                                </span>
                            )}
                        </div>
                    )
                )}

                <button
                    type="submit"
                    className="w-full bg-[#3D37FF] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                    Save Profile Changes
                </button>
            </form>
            {/* ================= UPDATE PASSWORD ================= */}
            <form
                onSubmit={submitPassword}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4"
            >
                <h3 className="text-lg font-semibold text-gray-700">
                    Security
                </h3>

                {/* Current Password */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                        Current Password
                    </label>
                    <input
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={(e) =>
                            passwordForm.setData(
                                "current_password",
                                e.target.value
                            )
                        }
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#3D37FF] focus:outline-none"
                    />
                    {passwordForm.errors.current_password && (
                        <span className="text-red-500 text-sm">
                            {passwordForm.errors.current_password}
                        </span>
                    )}
                </div>

                {/* New Password */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(e) =>
                            passwordForm.setData("password", e.target.value)
                        }
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#3D37FF] focus:outline-none"
                    />
                    {passwordForm.errors.password && (
                        <span className="text-red-500 text-sm">
                            {passwordForm.errors.password}
                        </span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) =>
                            passwordForm.setData(
                                "password_confirmation",
                                e.target.value
                            )
                        }
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#3D37FF] focus:outline-none"
                    />
                    {passwordForm.errors.password_confirmation && (
                        <span className="text-red-500 text-sm">
                            {passwordForm.errors.password_confirmation}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-800 text-white font-semibold py-2.5 rounded-lg hover:bg-black transition"
                >
                    Update Password
                </button>
            </form>

            {/* ================= NOTIFICATIONS & PREFERENCES ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* NOTIFICATIONS */}
                <form
                    onSubmit={submitNotifications}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4"
                >
                    <h3 className="text-lg font-semibold">Notifications</h3>

                    {Object.keys(notificationsForm.data).map((key) => (
                        <label
                            key={key}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={notificationsForm.data[key]}
                                onChange={(e) =>
                                    notificationsForm.setData(
                                        key,
                                        e.target.checked
                                    )
                                }
                            />
                            <span>
                                {key === "transactionAlerts"
                                    ? "Transaction Alerts"
                                    : key === "promotionalEmails"
                                    ? "Promotional Emails"
                                    : "App Push Notifications"}
                            </span>
                        </label>
                    ))}

                    <button
                        type="submit"
                        className="bg-[#3D37FF] text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Notifications
                    </button>
                </form>

                {/* PREFERENCES */}
                <form
                    onSubmit={submitPreferences}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4"
                >
                    <h3 className="text-lg font-semibold">Preferences</h3>

                    <select
                        value={preferencesForm.data.language}
                        onChange={(e) =>
                            preferencesForm.setData("language", e.target.value)
                        }
                        className="border p-2 rounded w-full"
                    >
                        <option>English</option>
                        <option>French</option>
                    </select>

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={preferencesForm.data.darkMode}
                            onChange={(e) =>
                                preferencesForm.setData(
                                    "darkMode",
                                    e.target.checked
                                )
                            }
                        />
                        <span>Enable Dark Mode</span>
                    </label>

                    <button
                        type="submit"
                        className="bg-[#3D37FF] text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Preferences
                    </button>
                </form>
            </div>
            {showCropper && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Crop Profile Photo
                        </h3>

                        <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedPixels) =>
                                    setCroppedAreaPixels(croppedPixels)
                                }
                            />
                        </div>

                        {/* Zoom slider */}
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCropper(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    const croppedBlob = await getCroppedImg(
                                        imageSrc,
                                        croppedAreaPixels
                                    );

                                    // Convert Blob to File
                                    const croppedFile = new File(
                                        [croppedBlob],
                                        "profile_photo.png",
                                        {
                                            type: "image/png",
                                        }
                                    );

                                    // Set in Inertia form
                                    profileForm.setData(
                                        "profile_photo",
                                        croppedFile
                                    );

                                    setShowCropper(false);

                                    // Send to backend
                                    profileForm.post(route("updateprofile"), {
                                        forceFormData: true,
                                        preserveScroll: true,
                                    });
                                }}
                                className="px-4 py-2 rounded bg-[#3D37FF] text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

SettingsPage.layout = (page) => {
    const authUser = page.props?.authUser; // get user from Inertia props

    const Layout = (() => {
        switch (authUser?.role?.role_name) {
            case "user":
                return AppLayout;
            case "it_admin":
            case "overall_admin":
            case "branch_manager":
            case "loan_officer":
            case "accountant":
            case "support_officer":
            case "agent":
                return AdminLayout;
            default:
                return AppLayout; // fallback layout
        }
    })();

    return <Layout>{page}</Layout>;
};
