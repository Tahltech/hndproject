import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";
import Icon from "@/Components/Icons";

export default function AllStaff({ staff }) {
    const {
        data = [],
        links = [],
        current_page = 1,
        per_page = 0,
    } = staff ?? {};

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        router.get(
            "/branch/staff",
            { search: value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    return (
        <>
            <Head title="All Branch Staff" />

            <main className="page space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-extrabold text-[var(--color-primary)]">
                        Branch Staff
                    </h1>

                    <input
                        type="text"
                        placeholder="Search staff..."
                        className="input border rounded px-3 py-2 w-full md:w-64"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>

               
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full bg-[var(--color-primary-light)] rounded-lg overflow-hidden">
                        <thead className="bg-[var(--color-primary)] text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Photo</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Zone</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center">
                                        No staff found
                                    </td>
                                </tr>
                            ) : (
                                data.map((s, idx) => (
                                    <tr
                                        key={s.id}
                                        className="border-b hover:bg-white transition"
                                    >
                                        <td className="px-4 py-3">
                                            {(current_page - 1) * per_page +
                                                idx +
                                                1}
                                        </td>

                                        <td className="px-4 py-3">
                                            <img
                                                src={
                                                    s.profile_photo
                                                        ? `/storage/profile_photos/${s.profile_photo}`
                                                        : "/storage/profile_photos/default-avatar.png"
                                                }
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </td>

                                        <td className="px-4 py-3 font-semibold">
                                            {s.name}
                                        </td>
                                        <td className="px-4 py-3">{s.email}</td>
                                        <td className="px-4 py-3">
                                            {s.role?.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {s.zone?.name || "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="btn btn-sm btn-primary flex items-center gap-1"
                                                onClick={() =>
                                                    setSelectedStaff(s)
                                                }
                                            >
                                                <Icon name="eye" className="w-4 h-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* desktop Pagination */}
                    {links.length > 0 && (
                        <div className="flex justify-end mt-4 gap-2 flex-wrap">
                            {links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`px-3 py-1 rounded border
                                        ${
                                            link.active
                                                ? "bg-[var(--color-primary)] text-white"
                                                : "bg-white text-[var(--color-primary)]"
                                        }
                                        ${
                                            !link.url &&
                                            "opacity-50 pointer-events-none"
                                        }
                                    `}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

{/*MOBILE CARDS*/}
                <div className="md:hidden flex flex-col gap-4">
                    {data.map((s) => (
                        <div
                            key={s.id}
                            className="card bg-white rounded-lg p-4 shadow flex flex-col gap-3"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        s.profile_photo
                                            ? `/storage/profile_photos/${s.profile_photo}`
                                            : "/storage/profile_photos/default-avatar.png"
                                    }
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div>
                                    <p className="font-semibold">{s.name}</p>
                                    <p className="text-xs text-muted">
                                        {s.email}
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm space-y-1">
                                <p>
                                    <span className="font-semibold">Role:</span>{" "}
                                    {s.role?.name}
                                </p>
                                <p>
                                    <span className="font-semibold">Zone:</span>{" "}
                                    {s.zone?.name || "-"}
                                </p>
                            </div>

                            <button
                                className="btn btn-sm btn-primary flex items-center gap-1 mt-2"
                                onClick={() => setSelectedStaff(s)}
                            >
                                <Icon name="eye" className="w-4 h-4" />
                                View
                            </button>
                        </div>
                    ))}

                    {/* Mobile Pagination */}
                    {links.length > 0 && (
                        <div className="flex justify-center gap-2 mt-4 flex-wrap">
                            {links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`px-3 py-1 rounded border text-sm
                                        ${
                                            link.active
                                                ? "bg-[var(--color-primary)] text-white"
                                                : "bg-white text-[var(--color-primary)]"
                                        }
                                        ${
                                            !link.url &&
                                            "opacity-50 pointer-events-none"
                                        }
                                    `}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ===================== MODAL ===================== */}
                {selectedStaff && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                onClick={() => setSelectedStaff(null)}
                            >
                                ✕
                            </button>

                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={
                                        selectedStaff.profile_photo
                                            ? `/storage/profile_photos/${selectedStaff.profile_photo}`
                                            : "/storage/profile_photos/default-avatar.png"
                                    }
                                    className="w-20 h-20 rounded-full object-cover"
                                />

                                <h2 className="font-bold text-lg">
                                    {selectedStaff.name}
                                </h2>
                                <p className="text-sm text-muted">
                                    {selectedStaff.email}
                                </p>
                                 <p>
                                    <span className="font-semibold">Contact:</span>{" "}
                                    {selectedStaff.number}
                                </p>

                                <p>
                                    <span className="font-semibold">Role:</span>{" "}
                                    {selectedStaff.role?.name}
                                </p>
                                {selectedStaff.zone ? (
                                     <p>
                                    <span className="font-semibold">Zone:</span>{" "}
                                    {selectedStaff.zone?.name || "-"}
                                </p>

                                ): ""}
                               
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

AllStaff.layout = (page) => <AdminLayout>{page}</AdminLayout>;
