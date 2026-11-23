import React, { useEffect, useRef, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";
import ClinicLayout from "@/Layouts/ClinicLayout";
import AppointmentsTable, {
    AppointmentDetailsModal,
} from "@/Pages/Appointments/AppointmentsTable";
import NewAppointmentModal from "@/Components/NewAppointmentModal";
import AddAppointmentPopup from "@/Components/AddAppointmentPopup";

const FILTERS = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "missed", label: "Missed" },
];

export default function AppointmentsPage({
    appointments,
    filters,
    patients = [],
    services = [],
    title = "Appointments",
    routeName = "appointments.index",
}) {
    const { props } = usePage();
    const safeFilters = filters || {};
    const stats = props?.appointmentStats ?? {};
    const [search, setSearch] = useState(safeFilters.search || "");
    const [activeTab, setActiveTab] = useState(safeFilters.tab || "all");

    // Modal state
    const [showNew, setShowNew] = useState(false);
    const [detailsAppt, setDetailsAppt] = useState(null);
    const [editingAppt, setEditingAppt] = useState(null);

    const isFirstSearchEffect = useRef(true);

    useEffect(() => {
        // Don't fire a filter navigation on mount: it would cancel a
        // pagination visit (e.g. clicking "Next") started right away.
        if (isFirstSearchEffect.current) {
            isFirstSearchEffect.current = false;
            return;
        }

        const t = setTimeout(() => {
            const params = {};
            if (search) params.search = search;
            if (safeFilters.status) params.status = safeFilters.status;
            if (activeTab !== "all") params.tab = activeTab;

            router.get(route(routeName), params, {
                preserveState: true,
                replace: true,
            });
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const switchTab = (tab) => {
        setActiveTab(tab);
        const params = {};
        if (search) params.search = search;
        if (safeFilters.status) params.status = safeFilters.status;
        if (tab !== "all") params.tab = tab;

        router.get(route(routeName), params, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <ClinicLayout>
            <Head title={title} />

            <div className="mx-auto w-full max-w-[1600px] px-5 py-10 lg:px-16">
                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-clinic-accent">
                            Clinic Schedule
                        </p>
                        <h1 className="mt-3 text-[2.75rem] font-semibold leading-tight tracking-[-0.02em] text-clinic-ink">
                            Appointments
                        </h1>
                        <p className="mt-3 text-[16px] text-slate-500">
                            Review and manage upcoming patient visits.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowNew(true)}
                        className="flex items-center gap-2.5 rounded-xl bg-clinic-navy px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c]"
                    >
                        <Plus className="h-5 w-5" />
                        New appointment
                    </button>
                </div>

                {/* Stats bar */}
                <div className="mb-6 grid grid-cols-1 divide-y divide-clinic-line overflow-hidden rounded-2xl border border-clinic-line bg-white shadow-[0_1px_2px_rgba(15,31,51,0.04)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    <StatBlock
                        value={stats.today ?? 0}
                        label="Today"
                        caption={`${stats.remaining_today ?? 0} remaining`}
                    />
                    <StatBlock
                        value={stats.upcoming ?? 0}
                        label="Upcoming"
                        caption="Next 7 days"
                    />
                    <StatBlock
                        value={stats.pending ?? 0}
                        label="Pending"
                        caption="Awaiting confirmation"
                    />
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-clinic-line bg-white shadow-[0_1px_2px_rgba(15,31,51,0.04)]">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-clinic-line px-7 py-5">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by patient name..."
                                className="w-full rounded-xl border border-clinic-line bg-white py-2.5 pl-11 pr-4 text-[14px] text-clinic-ink placeholder:text-slate-400 focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                            />
                        </div>

                        <div className="inline-flex items-center gap-1 rounded-xl border border-clinic-line bg-slate-50 p-1">
                            {FILTERS.map((f) => {
                                const active = activeTab === f.key;
                                return (
                                    <button
                                        key={f.key}
                                        type="button"
                                        onClick={() => switchTab(f.key)}
                                        className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold transition ${
                                            active
                                                ? "bg-white text-clinic-ink shadow-sm"
                                                : "text-slate-500 hover:text-clinic-ink"
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <AppointmentsTable
                        appointments={appointments?.data ?? []}
                        onViewDetails={(appt) => setDetailsAppt(appt)}
                        onEdit={(appt) => setEditingAppt(appt)}
                    />

                    {appointments?.links?.length > 3 && (
                        <div className="flex justify-center gap-2 border-t border-clinic-line px-7 py-5">
                            {appointments.links.map((link, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() =>
                                        link.url && router.visit(link.url)
                                    }
                                    disabled={!link.url}
                                    className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${
                                        link.active
                                            ? "bg-clinic-navy text-white"
                                            : "border border-clinic-line bg-white text-clinic-ink hover:bg-slate-50 disabled:opacity-40"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* New appointment modal */}
            <NewAppointmentModal
                show={showNew}
                onClose={() => setShowNew(false)}
                patients={patients}
                services={services}
                onSaved={() => {
                    setShowNew(false);
                    router.reload();
                }}
            />

            {editingAppt && (
                <AddAppointmentPopup
                    mode="edit"
                    appointment={editingAppt}
                    onClose={() => setEditingAppt(null)}
                    onSaved={() => {
                        setEditingAppt(null);
                        router.reload({ only: ["appointments", "appointmentStats"] });
                    }}
                />
            )}

            {/* Details modal */}
            <AppointmentDetailsModal
                appointment={detailsAppt}
                onClose={() => setDetailsAppt(null)}
            />
        </ClinicLayout>
    );
}

function StatBlock({ value, label, caption }) {
    return (
        <div className="flex items-baseline gap-3 px-7 py-6">
            <span className="text-[28px] font-bold leading-none text-clinic-ink">
                {value}
            </span>
            <div className="leading-tight">
                <p className="text-[14px] font-semibold text-clinic-ink">
                    {label}
                </p>
                <p className="text-[12px] text-slate-500">{caption}</p>
            </div>
        </div>
    );
}