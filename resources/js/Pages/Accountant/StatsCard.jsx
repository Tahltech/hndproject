import React from "react";

export default function StatCard({
  title,
  value,
  variant = "default",
  size = "md",
}) {
  const variants = {
    default: {
      bg: "var(--color-surface)",
      color: "var(--color-text-primary)",
    },
    success: {
      bg: "rgba(0, 200, 150, 0.08)",
      color: "var(--color-success)",
    },
    warning: {
      bg: "rgba(242, 95, 82, 0.08)",
      color: "var(--color-warning)",
    },
    danger: {
      bg: "rgba(255, 202, 65, 0.12)",
      color: "var(--color-danger)",
    },
  };

  const sizes = {
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className="card flex flex-col gap-2"
      style={{ backgroundColor: variants[variant].bg }}
    >
      {/* Title */}
      <span className="text-sm font-medium text-[var(--color-text-muted)]">
        {title}
      </span>

      {/* Value (BIG NUMBER SAFE) */}
      <span
        className={`font-bold leading-tight break-words whitespace-normal ${sizes[size]}`}
        style={{ color: variants[variant].color }}
      >
        {value}
      </span>
    </div>
  );
}
