import React, { useEffect, useState } from "react";
import { useForm, Head, router } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";
import AdminLayout from "../Layout/AdminLayout";
import CropModal from "../../Components/CropModal";
import VerifyCodeModal from "@/Components/PasswordModal";
import { route } from "ziggy-js";

export default function SettingsPage({ authUser }) {
    const [showCropper, setShowCropper] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [pendingPassword, setPendingPassword] = useState("");

    const avatarForm = useForm({ profile_photo: null });

    const profileForm = useForm({
        full_name: authUser?.full_name || "",
        username: authUser?.username || "",
        email: authUser?.email || "",
        phone_number: authUser?.phone_number || "",
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const notificationsForm = useForm({
        transactionAlerts: true,
        promotionalEmails: false,
        pushNotifications: true,
    });

    // Initialize preferences form from backend or localStorage
    const preferencesForm = useForm({
        language: authUser?.preferences?.language ?? "English",
        darkMode:
            localStorage.getItem("darkMode") !== null
                ? localStorage.getItem("darkMode") === "true"
                : authUser?.preferences?.darkMode ?? false,
    });

    // Apply dark mode on mount
    useEffect(() => {
        if (preferencesForm.data.darkMode) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
    }, []);

    const avatarSrc = authUser?.profile_photo
        ? `/storage/profile_photos/${authUser.profile_photo}`
        : `/storage/profile_photos/default-avatar.png`;

    /** Submit profile info */
    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post(route("updateprofile"), { preserveScroll: true });
    };

    /** Submit password */
    const submitPassword = (e) => {
        e.preventDefault();
        setPendingPassword(passwordForm.data.password);

        passwordForm.post(route("passwordupdaterequest"), {
            preserveScroll: true,
            onSuccess: () => setShowVerifyModal(true),
        });
    };

    /** Submit notifications */
    const submitNotifications = (e) => {
        e.preventDefault();
        notificationsForm.post("/settings/notifications", {
            preserveScroll: true,
        });
    };

    /** Submit preferences to backend */
    const submitPreferences = (e) => {
        e.preventDefault();

        router.post(route("updatepreferences"), {
            language: preferencesForm.data.language,
            darkMode: preferencesForm.data.darkMode,
        });
    };

    /** Toggle dark mode */
    const handleDarkModeToggle = (checked) => {
        preferencesForm.setData("darkMode", checked);

        if (checked) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        localStorage.setItem("darkMode", checked);
    };

    return (
        <div className="page max-w-7xl mx-auto space-y-10">
            <Head title="Settings" />

            {/* PROFILE */}
            <div className="flex items-center space-x-6 card">
                <div className="relative group">
                    <img
                        src={avatarSrc}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-2 border-[var(--color-primary)]"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
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
                        <span className="text-white font-semibold">Change</span>
                    </label>
                </div>

                <div>
                    <h2 className="text-2xl font-bold">
                        {authUser?.full_name}
                    </h2>
                    <p className="text-sm text-muted">@{authUser?.username}</p>

                    <button
                        className="btn btn-primary mt-4"
                        disabled={
                            !avatarForm.data.profile_photo ||
                            avatarForm.processing
                        }
                        onClick={() =>
                            avatarForm.post(route("updateprofile-photo"), {
                                forceFormData: true,
                                preserveScroll: true,
                                onSuccess: () =>
                                    avatarForm.reset("profile_photo"),
                            })
                        }
                    >
                        {avatarForm.processing
                            ? "Uploading..."
                            : "Update Profile Photo"}
                    </button>
                </div>
            </div>

            {/* ACCOUNT */}
            <form onSubmit={submitProfile} className="card space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                {["full_name", "username", "email", "phone_number"].map(
                    (field) => (
                        <input
                            key={field}
                            className="input"
                            value={profileForm.data[field]}
                            onChange={(e) =>
                                profileForm.setData(field, e.target.value)
                            }
                        />
                    )
                )}
                <button className="btn btn-primary w-full">Save Changes</button>
            </form>

            {/* SECURITY */}
            <form onSubmit={submitPassword} className="card space-y-4">
                <h3 className="text-lg font-semibold">Security</h3>
                <input
                    className="input"
                    type="password"
                    placeholder="Current Password"
                    onChange={(e) =>
                        passwordForm.setData("current_password", e.target.value)
                    }
                />
                <input
                    className="input"
                    type="password"
                    placeholder="New Password"
                    onChange={(e) =>
                        passwordForm.setData("password", e.target.value)
                    }
                />
                <input
                    className="input"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) =>
                        passwordForm.setData(
                            "password_confirmation",
                            e.target.value
                        )
                    }
                />
                <button className="btn btn-primary w-full">
                    Update Password
                </button>
            </form>

            {/* NOTIFICATIONS & PREFERENCES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notifications */}
                <form onSubmit={submitNotifications} className="card space-y-3">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    {Object.keys(notificationsForm.data).map((key) => (
                        <label key={key} className="flex gap-2">
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
                            {key}
                        </label>
                    ))}
                    <button className="btn btn-primary">Save</button>
                </form>

                {/* Preferences */}
                <form onSubmit={submitPreferences} className="card space-y-3">
                    <h3 className="text-lg font-semibold">Preferences</h3>

                    <select
                        className="input"
                        value={preferencesForm.data.language}
                        onChange={(e) =>
                            preferencesForm.setData(
                                "language",
                                e.target.value
                            )
                        }
                    >
                        <option>English</option>
                        <option>French</option>
                    </select>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={preferencesForm.data.darkMode}
                            onChange={(e) =>
                                handleDarkModeToggle(e.target.checked)
                            }
                        />
                        Enable Dark Mode
                    </label>

                    <button className="btn btn-primary">Save Preferences</button>
                </form>
            </div>

            <VerifyCodeModal
                show={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
                newPassword={pendingPassword}
            />
            <CropModal
                isOpen={showCropper}
                imageSrc={imageSrc}
                onClose={() => setShowCropper(false)}
                onCropComplete={(file) => {
                    avatarForm.setData("profile_photo", file);
                    setShowCropper(false);
                }}
            />
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
