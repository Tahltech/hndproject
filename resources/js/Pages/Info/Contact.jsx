import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "../Layout/PublicLayout";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send to backend
        alert("Message sent!"); // Placeholder
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <PublicLayout>
            <Head title="Contact Us" />

            {/* Hero */}
            <section className="bg-[var(--color-primary-light)] dark:bg-[var(--color-surface)] py-20 px-6 md:px-10 rounded-xl mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Contact <span className="brand-accent">TahlFIN</span>
                </h1>
                <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-2xl mx-auto">
                    We’re here to help! Reach out to our team with any questions, feedback, or partnership inquiries.
                </p>
            </section>

            {/* Contact Form */}
            <section className="max-w-3xl mx-auto bg-[var(--color-surface)] dark:bg-[var(--color-background)] rounded-xl shadow-md p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input w-full"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input w-full"
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input w-full h-32 resize-none"
                        required
                    />
                    <button className="btn btn-primary w-full py-3 text-lg">
                        Send Message
                    </button>
                </form>
            </section>

            {/* Contact Info */}
            <section className="max-w-6xl mx-auto mt-16 px-6 md:px-10 grid md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Email</h3>
                    <p className="text-[var(--color-text-secondary)]">tahltech0@gmail.com</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Phone</h3>
                    <p className="text-[var(--color-text-secondary)]">+237680190906</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Address</h3>
                    <p className="text-[var(--color-text-secondary)]">
                        Yaounde, Cameroon
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
