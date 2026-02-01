import React from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "../Layout/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <Head title="About Us" />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary-light)] dark:bg-[var(--color-surface)] py-20 px-6 md:px-10 rounded-xl mb-10">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="brand-accent">TahlFIN</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg md:text-xl">
            At TahlFIN, we provide modern financial solutions designed for speed, security, and growth. 
            Our mission is to empower individuals and businesses with reliable tools to manage, invest, 
            and grow their finances effortlessly.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 mb-10 px-6 md:px-10">
        <div>
          <img
            src="/Images/finance-team.jpg"
            alt="Finance Team"
            className="rounded-xl shadow-md"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-[var(--color-text-secondary)] text-lg">
            We strive to make financial management simple, transparent, and secure for everyone. 
            Through innovative technology and personalized solutions, TahlFIN is helping people achieve 
            their financial goals with confidence.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-[var(--color-primary-light)] dark:bg-[var(--color-surface)] py-16 px-6 md:px-10 rounded-xl mb-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 bg-[var(--color-surface)] dark:bg-[var(--color-background)] rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Trust</h3>
              <p className="text-[var(--color-text-secondary)]">
                We prioritize security and transparency in everything we do, ensuring our users feel confident.
              </p>
            </div>
            <div className="p-6 bg-[var(--color-surface)] dark:bg-[var(--color-background)] rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-[var(--color-text-secondary)]">
                Constantly improving our platform with smart solutions to help our users manage their finances better.
              </p>
            </div>
            <div className="p-6 bg-[var(--color-surface)] dark:bg-[var(--color-background)] rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-[var(--color-text-secondary)]">
                Delivering the highest quality service and support to ensure a seamless financial experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 md:px-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to take control of your finances?
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Join TahlFIN today and experience the future of financial management.
        </p>
        <a
          href="/signup"
          className="btn btn-primary text-lg px-6 py-3"
        >
          Get Started
        </a>
      </section>
    </PublicLayout>
  );
}
