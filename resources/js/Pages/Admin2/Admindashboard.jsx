import React, { useEffect, useState } from "react";
import { usePage, router, Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "../Layout/AdminLayout";
import { route } from "ziggy-js";
import axios from "axios";
import Select from "react-select";
import Icon from "@/Components/Icons";

export default function BranchAdminDashboard() {
    const { authUser } = usePage();
    const { props } = usePage();
    const user = props.auth?.user;

    const { data, setData, post, processing } = useForm({
        agent_id: "",
        zone_id: "",
    });

    const [agents, setAgents] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get("/available/zones"),
            axios.get("/available/agents"),
        ])
            .then(([zonesRes, agentsRes]) => {
                setZones(zonesRes.data.zones || zonesRes.data || []);
                setAgents(agentsRes.data.agents || []);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const submitZone = (e) => {
        e.preventDefault();
        post(route("assignAgents"));
    };

    const deassignAgent = () => {
        if (!data.zone_id) return;

        if (!confirm("Are you sure you want to de-assign this agent?")) return;

        router.post(
            route("deassignagent"),
            { zone_id: data.zone_id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setData("agent_id", null);
                },
            }
        );
    };

    const zoneOptions = zones.map((zone) => ({
        value: zone.zone_id,
        label: zone.zonename || zone.name,
    }));

    const agentOptions = agents.map((agent) => ({
        value: agent.user_id,
        label: agent.is_assigned
            ? `${agent.agentname} (Assigned → ${agent.zone_name})`
            : agent.agentname,
        isDisabled: Number(agent.is_assigned) === 1,
    }));

    const assignedAgents = agents.filter(
        (agent) => Number(agent.is_assigned) === 1
    );

    const unassignedAgents = agents.filter(
        (agent) => Number(agent.is_assigned) === 0
    );

    return (
        <>
            <Head title="Branch Admin Dashboard" />

            <main className="page space-y-8">
                {/* ===== Top Right Bar ===== */}
                <div className="flex justify-end items-center gap-4">
                    {/* Bank Logo + Name */}
                    <div className="flex flex-col items-center cursor-pointer group">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-primary-light)] flex items-center justify-center group-hover:ring-2 group-hover:ring-[var(--color-primary)] transition">
                            <img
                                src={
                                    user?.bank?.bank_profile
                                        ? `/storage/bank_logos/${user.bank?.bank_profile}`
                                        : "/storage/profile_photos/default-avatar.png"
                                }
                                alt={user?.bank?.bank_name || "Bank Logo"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-xs font-semibold mt-1">
                            {user?.bank?.bank_name || "Bank Name"}
                        </p>
                    </div>

                    {/* View Branch Staff Button */}
                    <Link
                        href={route("branchStaff")} 
                        className="btn btn-sm btn-primary flex items-center gap-2 px-3 h-8"
                    >
                        <Icon name="users" className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                            View Staff
                        </span>
                    </Link>
                </div>

                {/* ===== Stats Cards ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card">
                        <p className="text-muted">Total Zones</p>
                        <h3 className="mt-2 font-extrabold text-[1.8rem]">
                            {zones.length}
                        </h3>
                    </div>

                    <div className="card">
                        <p className="text-muted">Total Agents</p>
                        <h3 className="mt-2 font-extrabold text-[1.8rem]">
                            {agents.length}
                        </h3>
                    </div>

                    <div className="card">
                        <p className="text-muted">Assigned Agents</p>
                        <h3 className="mt-2 font-extrabold text-[1.8rem]">
                            {assignedAgents.length}
                        </h3>
                    </div>

                    <div className="card">
                        <p className="text-muted">Unassigned Agents</p>
                        <h3 className="mt-2 font-extrabold text-[1.8rem]">
                            {unassignedAgents.length}
                        </h3>
                    </div>
                </div>

                {/* ===== Assign Agent Card ===== */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-[var(--color-border)]">
                        <h2 className="font-semibold text-lg">
                            Assign Agents to Zones
                        </h2>
                        <p className="text-sm text-muted mt-1">
                            Select an agent and a zone to assign.
                        </p>
                    </div>

                    <form
                        onSubmit={submitZone}
                        className="flex flex-wrap gap-6 px-6 py-4 items-end"
                    >
                        {/* Zone select */}
                        <div className="flex flex-col gap-1 min-w-[220px]">
                            <label className="text-xs text-muted">Zone</label>
                            <Select
                                options={zoneOptions}
                                value={zoneOptions.find(
                                    (z) => z.value === data.zone_id
                                )}
                                onChange={(option) => {
                                    setData("zone_id", option.value);

                                    const assignedAgent = agents.find(
                                        (a) => a.zone_id === option.value
                                    );

                                    setData(
                                        "agent_id",
                                        assignedAgent
                                            ? assignedAgent.user_id
                                            : ""
                                    );
                                }}
                                placeholder="Select zone"
                            />
                        </div>

                        {/* Agent select */}
                        <div className="flex flex-col gap-1 min-w-[220px]">
                            <label className="text-xs text-muted">Agent</label>
                            <Select
                                options={agentOptions}
                                value={agentOptions.find(
                                    (a) => a.value === data.agent_id
                                )}
                                onChange={(option) =>
                                    setData("agent_id", option.value)
                                }
                                placeholder="Select agent"
                            />
                        </div>

                        {/* Single toggle button */}
                        <button
                            type="submit"
                            disabled={
                                processing || !data.zone_id || !data.agent_id
                            }
                            className={`btn ${
                                agents.find(
                                    (a) =>
                                        a.user_id === data.agent_id &&
                                        Number(a.is_assigned) === 1
                                )
                                    ? "bg-[var(--color-warning)]" // De-assign color
                                    : "btn-primary"
                            } disabled:opacity-60`}
                            onClick={(e) => {
                                const selectedAgent = agents.find(
                                    (a) => a.user_id === data.agent_id
                                );

                                if (
                                    selectedAgent &&
                                    Number(selectedAgent.is_assigned) === 1
                                ) {
                                    // If agent is already assigned → de-assign
                                    e.preventDefault(); // prevent normal submit
                                    deassignAgent();
                                }
                            }}
                        >
                            {agents.find(
                                (a) =>
                                    a.user_id === data.agent_id &&
                                    Number(a.is_assigned) === 1
                            )
                                ? processing
                                    ? "Processing..."
                                    : "De-assign Agent"
                                : processing
                                ? "Assigning..."
                                : "Assign Agent"}
                        </button>
                    </form>
                </div>

            </main>
        </>
    );
}

BranchAdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
