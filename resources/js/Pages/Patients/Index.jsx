import React, { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Plus, Search, ChevronRight, UserPlus, X } from "lucide-react";
import ClinicLayout from "@/Layouts/ClinicLayout";
import Modal from "@/Components/Modal";
import InlineForm from "@/Pages/Patients/InlineForm";
import StatusPill from "@/Components/StatusPill";
import initials from "@/lib/initials";

function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d)
        ? "—"
        : d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          });
}

export default function Index({ patients, totalPatients }) {
    const { props } = usePage();
    const patientsData = patients?.data ?? [];
    const csrfToken =
        props?.csrfToken ||
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const [showRecordModal, setShowRecordModal] = useState(false);
    const [recordPatient, setRecordPatient] = useState(null);

    // Search + sort
    const [search, setSearch] = useState(props?.q || "");
    const [sort, setSort] = useState(props?.sort || "name");

    // Debounced search
    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route("patients.index"),
                { q: search || undefined, sort: sort || undefined },
                {
                    preserveState: true,
                    replace: true,
                    only: ["patients", "flash"],
                }
            );
        }, 500);
        return () => clearTimeout(t);
    }, [search, sort]);

    const openRecord = (patient) => {
        setRecordPatient(patient);
        setShowRecordModal(true);
    };

    return (
        <ClinicLayout>
            <Head title="Patients" />

            <div className="mx-auto w-full max-w-[1600px] px-5 py-10 lg:px-16">
                {/* ── Page header ───────────────────────────────────── */}
                <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-clinic-accent">
                            Patient Records
                        </p>
                        <h1 className="mt-3 text-[2.75rem] font-semibold leading-tight tracking-[-0.02em] text-clinic-ink">
                            Patients
                        </h1>
                        <p className="mt-3 text-[16px] text-slate-500">
                            Manage patient information and care history.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2.5 rounded-xl bg-clinic-navy px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c]"
                    >
                        <Plus className="h-5 w-5" />
                        Add patient
                    </button>
                </div>

                {/* ── Flash ─────────────────────────────────────────── */}
                {props?.flash?.success && (
                    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-[14px] text-emerald-800">
                        {props.flash.success}
                    </div>
                )}

                {/* ── Card ──────────────────────────────────────────── */}
                <div className="rounded-2xl border border-clinic-line bg-white shadow-[0_1px_2px_rgba(15,31,51,0.04)]">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-clinic-line px-7 py-6">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search patients..."
                                className="w-full rounded-xl border border-clinic-line bg-white py-3 pl-11 pr-4 text-[15px] text-clinic-ink placeholder:text-slate-400 focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                            />
                        </div>

                        <div className="flex items-center gap-2 text-[14px] text-slate-500">
                            <span className="font-bold text-clinic-ink">
                                {totalPatients ?? 0}
                            </span>
                            <span>active patients</span>
                        </div>
                    </div>

                    {/* Table — all columns centered */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-clinic-line text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                    <th className="px-7 py-4 text-center">Patient</th>
                                    <th className="px-7 py-4 text-center">Age</th>
                                    <th className="px-7 py-4 text-center">Contact</th>
                                    <th className="px-7 py-4 text-center">Last Visit</th>
                                    <th className="px-7 py-4 text-center">Status</th>
                                    <th className="px-7 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#edf0f4]">
                                {patientsData.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-7 py-16 text-center">
                                            <p className="text-[16px] font-medium text-slate-500">
                                                No patients found
                                            </p>
                                            <p className="mt-1 text-[14px] text-slate-400">
                                                Try adjusting your search or add a new patient.
                                            </p>
                                        </td>
                                    </tr>
                                )}

                                {patientsData.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="transition-colors hover:bg-slate-50/70"
                                    >
                                        <td className="px-7 py-5 text-center">
                                            <span className="text-[15px] font-semibold text-clinic-ink">
                                                {p.patient_name}
                                            </span>
                                        </td>

                                        <td className="px-7 py-5 text-center text-[15px] text-slate-600">
                                            {p.age ?? "—"}
                                        </td>

                                        <td className="px-7 py-5 text-center text-[15px] text-slate-600">
                                            {p.telephone || "—"}
                                        </td>

                                        <td className="px-7 py-5 text-center text-[15px] text-slate-600">
                                            {formatDate(
                                                p.last_visit ??
                                                    p.updated_at ??
                                                    p.created_at
                                            )}
                                        </td>

                                        <td className="px-7 py-5 text-center">
                                            <StatusPill status={p.status ?? "active"} />
                                        </td>

                                        <td className="px-7 py-5 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingPatient(p);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="rounded-xl border border-clinic-line bg-white px-4 py-2 text-[13px] font-semibold text-clinic-ink transition hover:border-clinic-blue hover:bg-slate-50"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => openRecord(p)}
                                                    className="group inline-flex items-center gap-1.5 rounded-xl border border-clinic-line bg-white px-4 py-2 text-[13px] font-semibold text-clinic-ink transition hover:border-clinic-blue hover:bg-slate-50"
                                                >
                                                    View record
                                                    <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-clinic-blue" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Add Patient Modal ─────────────────────────────────── */}
            <Modal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                maxWidth="2xl"
            >
                <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                    <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0fb] text-clinic-blue">
                            <UserPlus className="h-6 w-6" />
                        </span>
                        <div>
                            <h2 className="text-[20px] font-semibold text-clinic-ink">
                                Add a new patient
                            </h2>
                            <p className="mt-1 text-[14px] text-slate-500">
                                Create a patient profile for your clinic.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-8 py-7">
                    <InlineForm
                        onSuccess={() => {
                            setShowAddModal(false);
                            router.reload();
                        }}
                        onCancel={() => setShowAddModal(false)}
                    />
                </div>
            </Modal>

            {/* ── Edit Patient Modal ────────────────────────────────── */}
            <Modal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                maxWidth="2xl"
            >
                <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                    <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0fb] text-clinic-blue">
                            <UserPlus className="h-6 w-6" />
                        </span>
                        <div>
                            <h2 className="text-[20px] font-semibold text-clinic-ink">
                                Edit patient
                            </h2>
                            <p className="mt-1 text-[14px] text-slate-500">
                                Update this patient's information.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-8 py-7">
                    <InlineForm
                        patient={editingPatient}
                        onSuccess={() => {
                            setShowEditModal(false);
                            router.reload();
                        }}
                        onCancel={() => setShowEditModal(false)}
                    />
                </div>
            </Modal>

            {/* ── Patient Record Modal ──────────────────────────────── */}
            <Modal
                show={showRecordModal}
                onClose={() => setShowRecordModal(false)}
                maxWidth="2xl"
            >
                {recordPatient && (
                    <>
                        {/* Header: name + subtitle + close */}
                        <div className="flex items-start justify-between gap-4 border-b border-clinic-line px-8 py-7">
                            <div>
                                <h2 className="text-[24px] font-semibold leading-tight text-clinic-ink">
                                    {recordPatient.patient_name}
                                </h2>
                                <p className="mt-1 text-[14px] text-slate-500">
                                    Patient record and visit summary
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowRecordModal(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* 2×2 info grid */}
                        <div className="grid grid-cols-2">
                            <RecordCell
                                label="Age"
                                value={
                                    recordPatient.age
                                        ? `${recordPatient.age} years old`
                                        : "—"
                                }
                            />
                            <RecordCell
                                label="Contact number"
                                value={recordPatient.telephone || "—"}
                                rightBorder={false}
                            />

                            <RecordCell
                                label="Last visit"
                                value={formatDate(
                                    recordPatient.last_visit ??
                                        recordPatient.updated_at ??
                                        recordPatient.created_at
                                )}
                                bottomBorder={false}
                            />
                            <RecordCell
                                label="Patient status"
                                value={
                                    <StatusPill
                                        status={recordPatient.status ?? "active"}
                                    />
                                }
                                bottomBorder={false}
                                rightBorder={false}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end border-t border-clinic-line bg-slate-50/60 px-8 py-5">
                            <button
                                type="button"
                                onClick={() => setShowRecordModal(false)}
                                className="rounded-xl border border-clinic-line bg-white px-6 py-3 text-[14px] font-semibold text-clinic-ink transition hover:bg-slate-50"
                            >
                                Close record
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </ClinicLayout>
    );
}

/* Reusable cell for the 2×2 grid inside the record modal */
    function RecordCell({
        label,
        value,
        rightBorder = true,
        bottomBorder = true,
    }) 
{
    return (
        <div
            className={[
                "px-8 py-7",
                rightBorder ? "border-r border-clinic-line" : "",
                bottomBorder ? "border-b border-clinic-line" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <p className="text-[13px] font-medium text-slate-400">{label}</p>
            <div className="mt-2 text-[16px] font-semibold text-clinic-ink">
                {value}
            </div>
        </div>
    );
}