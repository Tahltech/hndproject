import { router, useForm } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";
import AdminLayout from "../Layout/AdminLayout";
import CropModal from "../../Components/CropModal";
import { useState } from "react";
import { route } from "ziggy-js";

export default function SettingsPage({ authUser }) {
    const [showCropper, setShowCropper] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

    const avatarForm = useForm({
        profile_photo: null,
    });

    /* ================= PROFILE FORM ================= */
    const profileForm = useForm({
        full_name: authUser?.full_name || "",
        username: authUser?.username || "",
        email: authUser?.email || "",
        phone_number: authUser?.phone_number || "",
    });

    const submitProfile = (e) => {
        e.preventDefault();

        profileForm.post(route("updateprofile"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const avatarSrc = authUser?.profile_photo
        ? `/storage/profile_photos/${authUser.profile_photo}`
        : `/storage/profile_photos/default-avatar.png`;

    /* ================= PASSWORD FORM ================= */
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

    return (
        <div className="page max-w-7xl mx-auto space-y-10">
            {/* ================= HEADER ================= */}
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

                    {/* Avatar click opens cropper */}
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

            {/* ================= PROFILE INFO ================= */}
            <form onSubmit={submitProfile} className="card space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>

                {["full_name", "username", "email", "phone_number"].map(
                    (field) => (
                        <div key={field} className="space-y-1">
                            <label className="text-sm font-medium">
                                {field.replace("_", " ").toUpperCase()}
                            </label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                value={profileForm.data[field]}
                                onChange={(e) =>
                                    profileForm.setData(field, e.target.value)
                                }
                                className="input"
                            />
                            {profileForm.errors[field] && (
                                <p className="text-sm danger">
                                    {profileForm.errors[field]}
                                </p>
                            )}
                        </div>
                    )
                )}

                <button
                    type="submit"
                    disabled={profileForm.processing}
                    className="btn btn-primary w-full"
                >
                    {profileForm.processing
                        ? "Saving..."
                        : "Save Profile Changes"}
                </button>
            </form>

            {/* ================= SECURITY ================= */}
            <form onSubmit={submitPassword} className="card space-y-4">
                <h3 className="text-lg font-semibold">Security</h3>

                <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.data.current_password}
                    onChange={(e) =>
                        passwordForm.setData("current_password", e.target.value)
                    }
                    className="input"
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.data.password}
                    onChange={(e) =>
                        passwordForm.setData("password", e.target.value)
                    }
                    className="input"
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.data.password_confirmation}
                    onChange={(e) =>
                        passwordForm.setData(
                            "password_confirmation",
                            e.target.value
                        )
                    }
                    className="input"
                />

                <button className="btn btn-primary w-full">
                    Update Password
                </button>
            </form>

            {/* ================= NOTIFICATIONS & PREFERENCES ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notifications */}
                <form onSubmit={submitNotifications} className="card space-y-3">
                    <h3 className="text-lg font-semibold">Notifications</h3>

                    {Object.keys(notificationsForm.data).map((key) => (
                        <label key={key} className="flex items-center gap-2">
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
                                    : "Push Notifications"}
                            </span>
                        </label>
                    ))}

                    <button className="btn btn-primary">
                        Save Notifications
                    </button>
                </form>

                {/* Preferences */}
                <form onSubmit={submitPreferences} className="card space-y-3">
                    <h3 className="text-lg font-semibold">Preferences</h3>

                    <select
                        value={preferencesForm.data.language}
                        onChange={(e) =>
                            preferencesForm.setData("language", e.target.value)
                        }
                        className="input"
                    >
                        <option>English</option>
                        <option>French</option>
                    </select>

                    <label className="flex items-center gap-2">
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

                    <button className="btn btn-primary">
                        Save Preferences
                    </button>
                </form>
            </div>
            {showCropper && (
                <CropModal
                    imageSrc={imageSrc}
                    onClose={() => setShowCropper(false)}
                  
                    onCropComplete={(file) => {
                    avatarForm.setData("profile_photo", file);
                      router.post(route("updateprofile-photo"), {
                            forceFormData: true,
                            preserveScroll: true,
                            onFinish: () => {
                                setShowCropper(false);
                                avatarForm.reset("profile_photo");
                            },
                        });
                    }}
                />
            )}
        </div>
    );
}

SettingsPage.layout = (page) => {
    const authUser = page.props?.authUser;

    const Layout = [
        "it_admin",
        "overall_admin",
        "branch_manager",
        "loan_officer",
        "accountant",
        "support_officer",
        "agent",
    ].includes(authUser?.role?.role_name)
        ? AdminLayout
        : AppLayout;

    return <Layout>{page}</Layout>;
};
