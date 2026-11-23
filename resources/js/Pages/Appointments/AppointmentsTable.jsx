import React, { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import Modal from "@/Components/Modal";
import StatusPill from "@/Components/StatusPill";
import dayjs from "dayjs";
import AppointmentsTableViewButtonModal from "@/Pages/Appointments/Components/AppointmentsTableViewModal";
import AppointmentsTableRescheduleButton from "@/Pages/Appointments/Components/AppointmentsTableRescheduleModal";

/* ── Cancel button ─────────────────────────────────────────────── */
function CancelButton({ appointment }) {
    const handleCancel = async () => {
        if (!confirm(`Cancel appointment for ${appointment.patient_name}?`)) {
            return;
        }

        try {
            await axios.put(`/appointments/${appointment.id}/cancel`);
            router.reload({ only: ["appointments", "appointmentStats"] });
        } catch (error) {
            console.error(error);
            alert("Failed to cancel appointment.");
        }
    };

    const status = (appointment.visit_status || "").toLowerCase();
    if (status === "cancelled" || status === "canceled" || status === "completed") {
        return null;
    }

    return (
        <button
            type="button"
            onClick={handleCancel}
            className="text-red-600 hover:text-red-700 font-medium text-sm tracking-wide transition hover:underline hover:underline-offset-4"
        >
            Cancel
        </button>
    );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Main table                                                          */
/* ─────────────────────────────────────────────────────────────────── */
export default function AppointmentsTable({ appointments, onViewDetails, onEdit }) {
    const rows = Array.isArray(appointments)
        ? appointments
        : (appointments?.data ?? []);

    const [details, setDetails] = useState(null);

    const handleRowClick = (appt) => {
        // Prefer parent handler if provided, else use local modal
        if (onViewDetails) onViewDetails(appt);
        else setDetails(appt);
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-clinic-line text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                            <th className="px-7 py-4 text-center">Patient</th>
                            <th className="px-7 py-4 text-center">Service</th>
                            <th className="px-7 py-4 text-center">Date &amp; Time</th>
                            <th className="px-7 py-4 text-center">Status</th>
                            <th className="px-7 py-4 text-center">Balance</th>
                            <th className="px-7 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf0f4]">
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-7 py-16 text-center">
                                    <p className="text-[16px] font-medium text-slate-500">
                                        No appointments found
                                    </p>
                                    <p className="mt-1 text-[14px] text-slate-400">
                                        New bookings will appear here.
                                    </p>
                                </td>
                            </tr>
                        )}

                        {rows.map((appt) => (
                            <tr
                                key={appt.id}
                                className="transition-colors hover:bg-slate-50/70"
                            >
                                <td className="px-7 py-5 text-center text-[15px] font-semibold text-clinic-ink">
                                    {appt.patient_name}
                                </td>

                                <td className="px-7 py-5 text-center text-[14px] text-slate-600">
                                    {appt.service || "—"}
                                </td>

                                <td className="px-7 py-5 text-center text-[14px]">
                                    {appt.next_appointment_raw ? (
                                        <>
                                            <p className="font-semibold text-clinic-ink">
                                                {dayjs(appt.next_appointment_raw).format("MMM D")}
                                            </p>
                                            <p className="text-[12px] text-slate-400">
                                                {dayjs(appt.next_appointment_raw).format("h:mm A")}
                                            </p>
                                        </>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </td>

                                <td className="px-7 py-5 text-center">
                                    <StatusPill status={appt.visit_status} />
                                </td>

                                <td className="px-7 py-5 text-center text-[14px] font-semibold text-clinic-ink">
                                    ₱
                                    {Number(appt.balance ?? 0).toLocaleString("en-PH", {
                                        minimumFractionDigits: 2,
                                    })}
                                </td>

                                <td className="px-7 py-5 text-center">
                                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                                        <AppointmentsTableViewButtonModal appointment={appt} />

                                        <AppointmentsTableRescheduleButton appointment={appt} />

                                        <CancelButton appointment={appt} />

                                        <button
                                            type="button"
                                            onClick={() => onEdit?.(appt)}
                                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm tracking-wide transition hover:underline hover:underline-offset-4"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details modal (only used when no parent handler is provided) */}
            {!onViewDetails && (
                <AppointmentDetailsModal
                    appointment={details}
                    onClose={() => setDetails(null)}
                />
            )}
        </>
    );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Appointment details modal                                            */
/* ─────────────────────────────────────────────────────────────────── */
export function AppointmentDetailsModal({ appointment, onClose }) {
    const show = !!appointment;

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            {appointment && (
                <>
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                        <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fdf1e1] text-clinic-accent">
                                <CalendarIcon className="h-6 w-6" />
                            </span>
                            <div>
                                <h2 className="text-[20px] font-semibold text-clinic-ink">
                                    Appointment details
                                </h2>
                                <p className="mt-1 text-[14px] text-slate-500">
                                    Visit information for {appointment.patient_name}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-8 py-7">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <Field label="Patient" value={appointment.patient_name} />
                            <Field
                                label="Date of visit"
                                value={
                                    appointment.next_appointment_raw
                                        ? dayjs(appointment.next_appointment_raw).format(
                                              "MMM D, YYYY · h:mm A"
                                          )
                                        : "—"
                                }
                            />
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6">
                            <Field
                                label="Next appointment"
                                value={
                                    appointment.next_appointment_raw
                                        ? dayjs(appointment.next_appointment_raw).format(
                                              "MMM D, YYYY · h:mm A"
                                          )
                                        : "—"
                                }
                            />
                            <Field label="Service" value={appointment.service || "—"} />
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6">
                            <Field
                                label="Status"
                                value={
                                    <StatusPill status={appointment.visit_status} />
                                }
                            />
                        </div>

                        <div className="my-7 border-t border-clinic-line" />

                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <Field
                                label="Complaint"
                                value={
                                    appointment.fullComplaint ||
                                    appointment.complaint ||
                                    "—"
                                }
                            />
                            <Field
                                label="Note"
                                value={appointment.fullNote || appointment.note || "—"}
                            />
                        </div>
                    </div>

                    {/* Financial summary */}
                    <div className="border-t border-clinic-line bg-slate-50/60 px-8 py-6">
                        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                            Financial Summary
                        </p>
                        <div className="grid grid-cols-3 gap-8">
                            <Field
                                label="Debit"
                                value={`₱${Number(appointment.debit ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                                valueClass="text-clinic-ink"
                            />
                            <Field
                                label="Credit"
                                value={`₱${Number(appointment.credit ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                                valueClass="text-[#e98b2a]"
                            />
                            <Field
                                label="Balance"
                                value={`₱${Number(appointment.balance ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                                valueClass="text-[#157a64]"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end border-t border-clinic-line bg-slate-50/60 px-8 py-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl bg-clinic-navy px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c]"
                        >
                            Close
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}

export function Field({ label, value, valueClass = "text-clinic-ink" }) {
    return (
        <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                {label}
            </p>
            <div className={`mt-2 text-[15px] font-semibold ${valueClass}`}>
                {value}
            </div>
        </div>
    );
}

export function CalendarIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <rect x="3" y="4.5" width="18" height="16" rx="2" />
            <path d="M3 9.5h18M8 3v3.5M16 3v3.5" />
        </svg>
    );
}