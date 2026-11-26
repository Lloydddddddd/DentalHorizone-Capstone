import React, { useEffect, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { CreditCard, Plus, Trash2, X } from "lucide-react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ToothExtractionPicker from "@/Components/ToothExtractionPicker";
import SearchableSelect from "@/Components/SearchableSelect";
import { CalendarIcon } from "@/Pages/Appointments/AppointmentsTable";

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "rescheduled", label: "Rescheduled" },
    { value: "cancelled", label: "Cancelled" },
];

const EMPTY_SERVICE = { id: "", note: "", teeth: [] };

export default function NewAppointmentModal({
    show,
    onClose,
    patients = [],
    services = [],
    onSaved,
}) {
    const [patientId, setPatientId] = useState("");
    const [complaint, setComplaint] = useState("");
    const [servicesList, setServicesList] = useState([
        { ...EMPTY_SERVICE, teeth: [] },
    ]);
    const [dateOfVisit, setDateOfVisit] = useState("");
    const [nextAppointment, setNextAppointment] = useState("");
    const [noNextAppointment, setNoNextAppointment] = useState(false);
    const [visitStatus, setVisitStatus] = useState("pending");
    const [debit, setDebit] = useState("");
    const [credit, setCredit] = useState("");
    const [note, setNote] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    /* Reset on open */
    useEffect(() => {
        if (show) {
            setPatientId("");
            setComplaint("");
            setServicesList([{ ...EMPTY_SERVICE, teeth: [] }]);
            setDateOfVisit("");
            setNextAppointment("");
            setNoNextAppointment(false);
            setVisitStatus("pending");
            setDebit("");
            setCredit("");
            setNote("");
            setErrors({});
            setProcessing(false);
        }
    }, [show]);

    /* Balance is derived */
    const balance = useMemo(() => {
        const d = parseFloat(debit) || 0;
        const c = parseFloat(credit) || 0;
        return d - c;
    }, [debit, credit]);

    /* Auto-fill debit from selected services */
    useEffect(() => {
        const total = servicesList.reduce((sum, s) => {
            const svc = services.find((x) => String(x.id) === String(s.id));
            return sum + (parseFloat(svc?.price) || 0);
        }, 0);
        if (total > 0) setDebit(String(total));
    }, [servicesList, services]);

    const addService = () =>
        setServicesList((prev) => [...prev, { ...EMPTY_SERVICE }]);

    const removeService = (index) =>
        setServicesList((prev) => prev.filter((_, i) => i !== index));

    const updateService = (index, key, value) =>
        setServicesList((prev) =>
            prev.map((s, i) =>
                i === index
                    ? {
                          ...s,
                          [key]: value,
                          // Changing the service invalidates previously picked teeth
                          ...(key === "id" ? { teeth: [] } : {}),
                      }
                    : s
            )
        );

    /* Tooth extraction services get the universal-numbering tooth picker */
    const isExtractionService = (serviceId) => {
        const service = services.find(
            (s) => String(s.id) === String(serviceId)
        );

        return !!service && /extraction/i.test(service.name || "");
    };

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            patient_id: patientId,
            complaint,
            date_of_visit: dateOfVisit,
            next_appointment: noNextAppointment ? null : nextAppointment || null,
            no_next_appointment: noNextAppointment,
            visit_status: visitStatus,
            debit: parseFloat(debit) || 0,
            credit: parseFloat(credit) || 0,
            balance,
            note,
            services: servicesList
                .filter((s) => s.id)
                .map((s) => ({
                    id: s.id,
                    note: s.note,
                    teeth: isExtractionService(s.id) ? s.teeth || [] : [],
                })),
        };

        setProcessing(true);
        setErrors({});

        router.post(route("appointments.store"), payload, {
            onSuccess: () => {
                setProcessing(false);
                onSaved ? onSaved() : onClose();
            },
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    const labelClass =
        "mb-2 block text-[13px] font-semibold text-clinic-ink";

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fdf1e1] text-clinic-accent">
                        <CalendarIcon className="h-6 w-6" />
                    </span>
                    <div>
                        <h2 className="text-[20px] font-semibold text-clinic-ink">
                            New appointment
                        </h2>
                        <p className="mt-1 text-[14px] text-slate-500">
                            Schedule a visit for an existing patient.
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
            <form
                onSubmit={submit}
                className="max-h-[70vh] overflow-y-auto px-8 py-7"
            >
                {/* Appointment details */}
                <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fdf1e1] text-clinic-accent">
                        <CalendarIcon className="h-4 w-4" />
                    </span>
                    <div>
                        <h3 className="text-[15px] font-semibold text-clinic-ink">
                            Appointment details
                        </h3>
                        <p className="text-[12px] text-slate-500">
                            Patient, services, and schedule.
                        </p>
                    </div>
                </div>

                {/* Patient */}
                <div>
                    <label className={labelClass}>Patient</label>
                    <SearchableSelect
                        options={patients.map((p) => ({
                            value: p.id,
                            label: p.patient_name,
                        }))}
                        value={patientId}
                        onChange={(value) => setPatientId(value)}
                        placeholder="Select a patient"
                        searchPlaceholder="Search patient name..."
                        emptyMessage="No patients found"
                        disabled={processing}
                    />
                    <InputError
                        message={errors.patient_id}
                        className="mt-1.5 text-[12px]"
                    />
                </div>

                {/* Complaint */}
                <div className="mt-5">
                    <label className={labelClass}>Complaint</label>
                    <TextInput
                        variant="clinic"
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                        placeholder="Enter the patient's primary concern"
                        disabled={processing}
                    />
                    <InputError
                        message={errors.complaint}
                        className="mt-1.5 text-[12px]"
                    />
                </div>

                {/* Services */}
                <div className="mt-5">
                    <label className={labelClass}>Services</label>
                    <div className="space-y-3">
                        {servicesList.map((srv, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <select
                                    value={srv.id}
                                    onChange={(e) =>
                                        updateService(index, "id", e.target.value)
                                    }
                                    disabled={processing}
                                    className="flex-1 rounded-xl border border-clinic-line bg-white px-4 py-3 text-[14px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                >
                                    <option value="">Select a service</option>
                                    {services.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} (₱{s.price})
                                        </option>
                                    ))}
                                </select>

                                <TextInput
                                    variant="clinic"
                                    value={srv.note}
                                    onChange={(e) =>
                                        updateService(index, "note", e.target.value)
                                    }
                                    placeholder="Service note"
                                    disabled={processing}
                                    className="flex-1"
                                />

                                {servicesList.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeService(index)}
                                        className="rounded-xl border border-red-200 bg-white p-3 text-red-500 transition hover:bg-red-50"
                                        aria-label="Remove service"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addService}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#e6f6f2] px-4 py-2 text-[13px] font-semibold text-[#157a64] transition hover:bg-[#d6efe9]"
                    >
                        <Plus className="h-4 w-4" />
                        Add another service
                    </button>

                    {/* Tooth picker for every selected extraction service */}
                    {servicesList.map((srv, index) =>
                        isExtractionService(srv.id) ? (
                            <ToothExtractionPicker
                                key={`teeth-${index}`}
                                selected={srv.teeth || []}
                                onChange={(teeth) =>
                                    updateService(index, "teeth", teeth)
                                }
                                disabled={processing}
                            />
                        ) : null
                    )}

                    <InputError
                        message={errors.services}
                        className="mt-1.5 text-[12px]"
                    />
                </div>

                {/* Date + next appointment */}
                <div className="mt-5 grid grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Date of visit</label>
                        <input
                            type="datetime-local"
                            value={dateOfVisit}
                            onChange={(e) => setDateOfVisit(e.target.value)}
                            disabled={processing}
                            className="w-full rounded-xl border border-clinic-line bg-white px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                        />
                        <InputError
                            message={errors.date_of_visit}
                            className="mt-1.5 text-[12px]"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Next appointment</label>
                        <input
                            type="datetime-local"
                            value={nextAppointment}
                            onChange={(e) => setNextAppointment(e.target.value)}
                            disabled={processing || noNextAppointment}
                            className="w-full rounded-xl border border-clinic-line bg-white px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15 disabled:bg-slate-50"
                        />
                        <label className="mt-2 flex items-center gap-2 text-[13px] text-slate-600">
                            <input
                                type="checkbox"
                                checked={noNextAppointment}
                                onChange={(e) =>
                                    setNoNextAppointment(e.target.checked)
                                }
                            />
                            No next appointment
                        </label>
                        <InputError
                            message={errors.next_appointment}
                            className="mt-1.5 text-[12px]"
                        />
                    </div>
                </div>

                {/* Visit status */}
                <div className="mt-5">
                    <label className={labelClass}>Visit status</label>
                    <select
                        value={visitStatus}
                        onChange={(e) => setVisitStatus(e.target.value)}
                        disabled={processing}
                        className="w-full rounded-xl border border-clinic-line bg-white px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                    >
                        {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Billing details */}
                <div className="mt-7 border-t border-clinic-line pt-6">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e6f6f2] text-[#157a64]">
                            <CreditCard className="h-4 w-4" />
                        </span>
                        <div>
                            <h3 className="text-[15px] font-semibold text-clinic-ink">
                                Billing details
                            </h3>
                            <p className="text-[12px] text-slate-500">
                                Charges, payment, and notes.
                            </p>
                        </div>
                    </div>

                {/* Debit / Credit */}
                <div className="mt-5 grid grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Debit</label>
                        <TextInput
                            variant="clinic"
                            type="number"
                            value={debit}
                            onChange={(e) => setDebit(e.target.value)}
                            placeholder="0.00"
                            disabled={processing}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Credit</label>
                        <TextInput
                            variant="clinic"
                            type="number"
                            value={credit}
                            onChange={(e) => setCredit(e.target.value)}
                            placeholder="0.00"
                            disabled={processing}
                        />
                    </div>
                </div>

                {/* Balance (read-only, green) */}
                <div className="mt-5">
                    <label className={labelClass}>Balance</label>
                    <div className="w-full rounded-xl border border-clinic-line bg-[#e6f6f2] px-4 py-3 text-[15px] font-bold text-[#157a64]">
                        ₱
                        {Number(balance).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                        })}
                    </div>
                </div>

                {/* Note */}
                <div className="mt-5">
                    <label className={labelClass}>Note</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Additional notes..."
                        rows={4}
                        disabled={processing}
                        className="w-full rounded-xl border border-clinic-line bg-white px-4 py-3 text-[15px] text-clinic-ink placeholder:text-slate-400 focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15 disabled:bg-slate-50"
                    />
                </div>
                </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-clinic-line bg-slate-50/60 px-8 py-5">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-clinic-line bg-white px-6 py-3 text-[14px] font-semibold text-clinic-ink transition hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={submit}
                    disabled={processing}
                    className="flex items-center gap-2 rounded-xl bg-clinic-navy px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c] disabled:opacity-60"
                >
                    <CalendarIcon className="h-4 w-4" />
                    {processing ? "Saving..." : "Schedule appointment"}
                </button>
            </div>
        </Modal>
    );
}