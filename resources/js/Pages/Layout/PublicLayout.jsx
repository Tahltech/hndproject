import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import Toast from "../../Components/Toast";
import { route } from "ziggy-js";
import { ToastProvider } from "../../Components/ToastContext";
export default function PublicLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <ToastProvider>
            <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
                {/* Header*/}
                <header className="w-full bg-[var(--color-surface)] shadow-sm max-w-7xl mx-auto px-4 md:px-10">
                    <div className="header-container flex items-center justify-between flex-wrap gap-2">
                        {/* Brand */}
                        <div className="app-brand flex items-center gap-2">
                            <img
                                src="/Images/Tahlfin.png"
                                alt="TahlFIN"
                                className="app-logo max-w-[100px] md:max-w-[130px]"
                            />
                            <div className="app-brand-text flex flex-col font-bold">
                                <span className="app-brand-title text-sm md:text-lg">
                                    Tahl
                                    <span className="brand-accent">FIN</span>
                                </span>
                                <p className="text-[var(--color-text-muted)] text-[10px] font-normal md:text-sm italic">
                                    Your Trusted Financial Expert
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6 font-bold">
                            {[
                                { name: "Home", href: route("home") },
                                { name: "About", href: "/about" },
                                { name: "Pricing", href: "/pricing" },
                                { name: "Contact", href: "/contact" },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="
                              relative text-[var(--color-text-primary)] 
                               hover:text-[var(--color-primary)] transition-colors duration-300
                               after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
                             after:bg-[var(--color-primary)] after:transition-all   after:duration-300 
                             hover:after:w-full"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* the hamburger menu for mobile  */}
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Get Started button smaller on mobile */}
                            <Link
                                href="/signup"
                                className="btn btn-primary text-xs md:text-sm px-3 py-1 md:px-4 md:py-2"
                            >
                                Get Started
                            </Link>

                            {/* Hamburger menu button for mobile */}
                            <button
                                className="md:hidden p-2 rounded-md text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                <span className="sr-only">Toggle menu</span>
                                {mobileMenuOpen ? (
                                    <svg
                                        className="w-5 h-5"
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
                                        className="w-5 h-5"
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
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-[var(--color-surface)] border-t border-[var(--color-border)]">
                            <nav className="flex flex-col p-4 space-y-2">
                                <Link
                                    href={route("home")}
                                    className="nav-link "
                                >
                                    Home
                                </Link>
                                <Link href="/about" className="nav-link">
                                    About
                                </Link>
                                <Link href="/pricing" className="nav-link">
                                    Pricing
                                </Link>
                                <Link href="/contact" className="nav-link">
                                    Contact
                                </Link>
                                {/* Sign In button under mobile nav */}
                                <Link
                                    href="/login"
                                    className="btn btn-outline w-full mt-2"
                                >
                                    Sign in
                                </Link>
                            </nav>
                        </div>
                    )}
                </header>

                {/* ===== Page Content ===== */}
                <main className="flex-grow page">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>

                {/* ===== Public Footer ===== */}
                <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
                    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-[var(--color-text-secondary)]">
                        <div>
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">
                                TahlFIN
                            </h4>
                            <p>
                                Modern financial solutions built for speed,
                                security, and growth.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">
                                Product
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/pricing"
                                        className="hover:underline"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="hover:underline"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">
                                Company
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/about"
                                        className="hover:underline"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/privacy-policy"
                                        className="hover:underline"
                                    >
                                        Privacy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-text-muted)]">
                        © {new Date().getFullYear()} TahlFIN. All rights
                        reserved.
                    </div>
                </footer>
            </div>
            <Toast />
        </ToastProvider>
    );
}
