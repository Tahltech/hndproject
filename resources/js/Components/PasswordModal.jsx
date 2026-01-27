import { useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function VerifyCodeModal({ show, onClose, newPassword }) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const submitCode = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post(
            route("passwordupdateconfirm"),
            {
                code,
                password: newPassword,
            },
            {
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    onClose();
                    alert("Password updated successfully!");
                },
                onError: () => {
                    alert("Invalid or expired code, try again.");
                },
            }
        );
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                    Enter Verification Code
                </h3>
                <form onSubmit={submitCode} className="space-y-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="input w-full"
                        placeholder="Enter code"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
