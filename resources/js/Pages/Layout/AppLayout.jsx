import React, { useState } from "react";
import Toast from "../../Components/Toast";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useForm } from "@inertiajs/react";
import { ToastProvider } from "../../Components/ToastContext";

export default function AppLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { post } = useForm();

    const handleLogout = () => {
        post(route("logout"));
    };

    return (
        <ToastProvider>
            <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text-primary)]">
                {/* Sidebar for Desktop */}
                <aside className="hidden md:flex md:flex-col w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] fixed top-0 left-0 h-screen">
                    {/* Brand / Logo */}
                    <div className="app-brand flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border)]">
                        <img
                            src="/Images/Tahlfin.png"
                            alt="TahlFIN"
                            className="app-logo max-w-[70px] md:max-w-[120px]"
                        />
                        <div className="app-brand-text flex flex-col">
                            <span className="app-brand-title text-sm md:text-lg font-semibold">
                                Tahl<span className="brand-accent">FIN</span>
                            </span>
                            <p className="text-[var(--color-text-muted)] text-[10px] md:text-sm">
                                Your Trusted Financial Expert
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 flex flex-col px-4 py-6 space-y-2 font-semibold overflow-y-auto">
                        <Link
                            href="/dashboard"
                            className="block py-2 px-3 rounded-md hover:bg-[var(--color-primary-light)] transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/transactions"
                            className="block py-2 px-3 rounded-md hover:bg-[var(--color-primary-light)] transition-colors"
                        >
                            Transactions
                        </Link>
                        <Link
                            href="/accounts"
                            className="block py-2 px-3 rounded-md hover:bg-[var(--color-primary-light)] transition-colors"
                        >
                            Accounts
                        </Link>
                        <Link
                            href="/settings"
                            className="block py-2 px-3 rounded-md hover:bg-[var(--color-primary-light)] transition-colors"
                        >
                            Settings
                        </Link>

                        {/* Logout button for desktop */}
                        <button
                            onClick={handleLogout}
                            className="btn-primary  btn btn-danger mt-4 w-full py-2"
                        >
                            Logout
                        </button>
                    </nav>
                </aside>

                {/* Mobile Top Navbar */}
                <div className="md:hidden w-full fixed top-0 left-0 z-20 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                    <header className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <img
                                src="/Images/Tahlfin.png"
                                alt="TahlFIN"
                                className="w-12 h-auto"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">
                                    Tahl
                                    <span className="brand-accent">FIN</span>
                                </span>
                                <p className="text-[var(--color-text-muted)] text-[10px]">
                                    Your Trusted Financial Expert
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Logout button for mobile */}
                            <button
                                onClick={handleLogout}
                                className="btn-primary btn-danger px-3 py-1 rounded-md text-sm"
                            >
                                Logout
                            </button>

                            <button
                                className="p-2 rounded-md text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                <span className="sr-only">Toggle menu</span>
                                {mobileMenuOpen ? (
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Mobile menu overlay */}
                    {mobileMenuOpen && (
                        <nav className="flex flex-col px-4 py-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-md">
                            <Link href="/dashboard" className="nav-link py-2">
                                Dashboard
                            </Link>
                            <Link
                                href="/transactions"
                                className="nav-link py-2"
                            >
                                Transactions
                            </Link>
                            <Link href="/accounts" className="nav-link py-2">
                                Accounts
                            </Link>
                            <Link href="/settings" className="nav-link py-2">
                                Settings
                            </Link>
                        </nav>
                    )}
                </div>

                {/* Main Content */}
                <main className="flex-1 px-6 py-6 md:ml-64 mt-0 md:mt-0 overflow-y-auto">
                    {children}
                </main>
            </div>
            <Toast />
        </ToastProvider>
    );
}
