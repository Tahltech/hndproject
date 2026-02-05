import React from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "../Layout/PublicLayout";
export default function PrivacyPolicy() {
    return (
        <div className="page max-w-4xl mx-auto">
            <Head title="Privacy Policy" />

            <div className="card">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold brand-accent">
                        Privacy Policy
                    </h1>
                    <p className="text-muted mt-2">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Intro */}
                <p className="mb-4">
                    Your privacy is important to us. This Privacy Policy
                    explains how we collect, use, protect, and disclose
                    information when you use our microfinance management
                    platform.
                </p>

                {/* Section 1 */}
                <section className="mb-5">
                    <h2 className="text-xl font-semibold mb-2">
                        1. Information We Collect
                    </h2>
                    <p>
                        We may collect the following types of information:
                    </p>
                    <ul className="list-disc ml-6 mt-2 text-[var(--color-text-secondary)]">
                        <li>Personal identification details (name, phone number, email)</li>
                        <li>Account and transaction information</li>
                        <li>Login credentials and access logs</li>
                        <li>Device and usage data</li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="mb-5">
                    <h2 className="text-xl font-semibold mb-2">
                        2. How We Use Your Information
                    </h2>
                    <p>
                        The information we collect is used to:
                    </p>
                    <ul className="list-disc ml-6 mt-2 text-[var(--color-text-secondary)]">
                        <li>Manage savings, withdrawals, and transactions</li>
                        <li>Verify user identity and prevent fraud</li>
                        <li>Improve system performance and user experience</li>
                        <li>Comply with legal and regulatory requirements</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-5">
                    <h2 className="text-xl font-semibold mb-2">
                        3. Data Protection & Security
                    </h2>
                    <p>
                        We implement industry-standard security measures to
                        protect your data from unauthorized access, alteration,
                        disclosure, or destruction. However, no system is 100%
                        secure, and we encourage users to protect their login
                        credentials.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="mb-5">
                    <h2 className="text-xl font-semibold mb-2">
                        4. Data Sharing
                    </h2>
                    <p>
                        We do not sell or rent your personal information.
                        Information may only be shared with:
                    </p>
                    <ul className="list-disc ml-6 mt-2 text-[var(--color-text-secondary)]">
                        <li>Authorized bank administrators and agents</li>
                        <li>Regulatory authorities when legally required</li>
                        <li>Service providers assisting system operations</li>
                    </ul>
                </section>

                {/* Section 5 */}
                <section className="mb-5">
                    <h2 className="text-xl font-semibold mb-2">
                        5. User Rights
                    </h2>
                    <p>
                        You have the right to:
                    </p>
                    <ul className="list-disc ml-6 mt-2 text-[var(--color-text-secondary)]">
                        <li>Access and review your personal data</li>
                        <li>Request corrections to inaccurate information</li>
                        <li>Request account deactivation subject to policy</li>
                    </ul>
                </section>

                {/* Section 6 */}
                <section className="mb-5">
                    <h2 className="text-xl font-semibold mb-2">
                        6. Cookies & Tracking
                    </h2>
                    <p>
                        We may use cookies and similar technologies to enhance
                        functionality, maintain sessions, and analyze system
                        usage. You can control cookies through your browser
                        settings.
                    </p>
                </section>

                {/* Section 7 */}
                <section className="mb-5">
                    <h2 className="text-xl font-semibold mb-2">
                        7. Policy Updates
                    </h2>
                    <p>
                        This Privacy Policy may be updated periodically.
                        Continued use of the platform after updates indicates
                        acceptance of the revised policy.
                    </p>
                </section>

                {/* Contact */}
                <section className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">
                        8. Contact Us
                    </h2>
                    <p>
                        If you have any questions or concerns about this Privacy
                        Policy, please contact your bank administrator or system
                        support team.
                    </p>
                </section>
            </div>
        </div>
    );
}

PrivacyPolicy.layout = (page)=><PublicLayout>{page}</PublicLayout>