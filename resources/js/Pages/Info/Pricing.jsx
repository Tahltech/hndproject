import React from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "../Layout/PublicLayout";

export default function Pricing() {
    const plans = [
        {
            name: "Basic",
            price: "$9.99/mo",
            features: ["Personal budget tracking", "Basic analytics", "Email support"],
        },
        {
            name: "Pro",
            price: "$29.99/mo",
            features: ["Everything in Basic", "Advanced analytics", "Priority support", "Investment tracking"],
        },
        {
            name: "Enterprise",
            price: "Custom",
            features: ["Custom solutions", "Dedicated account manager", "Advanced reporting", "Team management"],
        },
    ];

    return (
        <PublicLayout>
            <Head title="Pricing" />

            {/* Hero */}
            <section className="bg-[var(--color-primary-light)] dark:bg-[var(--color-surface)] py-20 px-6 md:px-10 rounded-xl mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Pricing <span className="brand-accent">Plans</span>
                </h1>
                <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-2xl mx-auto">
                    Flexible plans designed to suit individuals, professionals, and enterprises. No hidden fees.
                </p>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6 md:px-10 mb-16">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className="p-8 rounded-xl shadow-md hover:shadow-xl transition bg-[var(--color-surface)] dark:bg-[var(--color-background)]"
                    >
                        <h3 className="text-2xl font-bold mb-4 text-center">{plan.name}</h3>
                        <p className="text-3xl font-extrabold mb-6 text-center">{plan.price}</p>
                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature) => (
                                <li key={feature} className="text-[var(--color-text-secondary)]">
                                    • {feature}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="/signup"
                            className="btn btn-primary w-full text-center py-3 text-lg"
                        >
                            Choose Plan
                        </a>
                    </div>
                ))}
            </section>
        </PublicLayout>
    );
}
