
import React from "react";
import { useToast } from "./ToastContext";

export default function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] space-y-3 w-full max-w-sm">
      {toasts.map((toast, i) => (
        <div
          key={i}
          className={`
            relative overflow-hidden
            px-4 py-3 rounded-xl shadow-lg
            transition-all duration-500 ease-in-out
            animate-slide-in
            bg-[var(--color-surface)]
            border
            ${
              toast.type === "success"
                ? "border-l-4 border-[var(--color-success)]"
                : "border-l-4 border-[var(--color-danger)]"
            }
          `}
        >
          <p
            className={`
              text-sm font-medium
              ${
                toast.type === "success"
                  ? "text-[var(--color-success)]"
                  : "text-[var(--color-danger)]"
              }
            `}
          >
            {toast.message}
          </p>
        </div>
      ))}
    </div>
  );
}
