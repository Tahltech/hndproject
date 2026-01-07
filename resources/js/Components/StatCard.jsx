export default function StatCard({ title, value, variant = "default" }) {
  const variants = {
    default: "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
    success: "bg-[var(--color-success)] text-white",
    warning: "bg-[var(--color-warning)] text-white",
    danger: "bg-[var(--color-danger)] text-white",
  };

  return (
    <div className={`card p-5 rounded-lg ${variants[variant]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 text-xl font-bold break-words">{value}</p>
    </div>
  );
}
