import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Toast from "../../Components/Toast";
import { ToastProvider } from "../../Components/ToastContext";
import Icon from "../../Components/Icons";

export default function AppLayout({ children }) {
    const { authUser } = usePage().props;

    const isDark = authUser?.preferences?.darkMode;

    const { props } = usePage();
    const user = props.auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { post } = useForm();

    const handleLogout = () => {
        post(route("logout"));
    };

    const navItems = [
        { name: "Dashboard", href: route("userdashboard"), icon: "dashboard" },
        {
            name: "Transactions",
            href: route("getransaction"),
            icon: "transaction",
        },
        {
            name: "Loan Services",
            href: route("userloanservices"),
            icon: "loan",
        },
        { name: "Loan Repayment", href: route("loanrepayment"), icon: "loan" },
        { name:"Join bank", href:route("user.requestbank"), icon: "bank"},
        { name: "My Kyc", href: route("userkycpage"), icon: "files" },
        { name: "Settings", href: "/settings", icon: "settings" },
    ];

    const NavItem = ({ href, icon, name, onClick }) => (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-[var(--color-primary-light)] transition"
        >
            <Icon name={icon} className="w-5 h-5" />
            {name}
        </Link>
    );

    return (
        <ToastProvider>
            <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text-primary)]">
                <aside className="hidden md:flex md:flex-col w-64 fixed inset-y-0 left-0 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
                    {/* BRAND */}
                    <div className="app-brand flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border)]">
                        <img
                            src="/Images/Tahlfin.png"
                            alt="TahlFIN"
                            className="app-logo max-w-[70px] md:max-w-[120px]"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm md:text-lg font-semibold">
                                Tahl<span className="brand-accent">FIN</span>
                            </span>
                            <p className="text-[var(--color-text-muted)] text-[10px] md:text-sm italic">
                                Your Trusted Financial Expert...
                            </p>
                        </div>
                    </div>

                    {/* NAV */}
                    <nav className="flex-1 px-4 py-6 space-y-1 font-bold overflow-y-auto">
                        {navItems.map((item, i) => (
                            <NavItem key={i} {...item} />
                        ))}

                        <button
                            onClick={handleLogout}
                            className="mt-6 w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            <Icon name="logout" className="w-5 h-5" />
                            Logout
                        </button>
                    </nav>
                </aside>

                <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                    <header className="flex justify-between items-center px-4 py-3">
                        {/* LOGO */}
                        <div className="flex items-center gap-2">
                            <img
                                src="/Images/Tahlfin.png"
                                className="w-12 h-auto"
                                alt="TahlFIN"
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

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 rounded-md text-sm font-bold text-red-600 hover:bg-red-50 transition"
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
                                    // X icon when menu is open
                                    <Icon name="x" className="w-6 h-6" />
                                ) : (
                                    // Hamburger icon when menu is closed
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

                    {/* MOBILE MENU */}
                    {mobileMenuOpen && (
                        <nav className="px-4 py-4 space-y-2 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-md">
                            {navItems.map((item, i) => (
                                <NavItem
                                    key={i}
                                    {...item}
                                    onClick={() => setMobileMenuOpen(false)}
                                />
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-bold"
                            >
                                <Icon name="logout" className="w-5 h-5" />
                                Logout
                            </button>
                        </nav>
                    )}
                </div>

                {/* ================= MAIN CONTENT ================= */}
                <main className={`${isDark ? "theme-dark" : "theme-light"} flex-1 md:ml-64 px-6 py-6 mt-14 md:mt-0 overflow-y-auto` }>
                    {children}
                </main>
            </div>

            <Toast />
        </ToastProvider>
    );
}
