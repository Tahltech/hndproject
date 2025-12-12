import React from "react";
import { Link } from "@inertiajs/react";
import logo from "../assets/Tahlfin.png";
import Toast from "../../Components/Toast";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            {/* Header */}
            <Toast />
         <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md z-[1000]">
               
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-2">
                        <img
                            src="/Images/Tahlfin.png"
                            alt="TahlFIN Logo"
                            className="h-17 w-auto"
                        />
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-wide">
                                Tahl<span className="text-yellow-400">FIN</span>
                            </h1>
                            <p className="text-xs text-gray-200 italic">
                                Your trusted finance expert
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="hover:text-yellow-300">
                            Home
                        </Link>
                        <Link href="/about" className="hover:text-yellow-300">
                            About
                        </Link>
                        <Link
                            href="/services"
                            className="hover:text-yellow-300"
                        >
                            Services
                        </Link>
                        <Link href="/contact" className="hover:text-yellow-300">
                            Contact
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main content takes available space */}
            <main className="flex-grow max-w-7xl mx-auto p-6 mt-18  w-full">{children}</main>

            {/* Footer stays at the bottom */}
            <footer className="bg-blue-900 text-gray-300 text-sm py-4 mt-auto">
                <div className="max-w-7xl mx-auto flex justify-center items-center">
                    <p className="text-gray-100 text-sm">
                        &copy; {new Date().getFullYear()}{" "}
                        <span className="font-extrabold text-yellow-500">
                            TahlFIN
                        </span>{" "}
                        — All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
