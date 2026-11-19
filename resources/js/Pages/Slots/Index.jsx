import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Plus, Trash2, Pencil, CalendarDays, X } from "lucide-react";
import ClinicLayout from "@/Layouts/ClinicLayout";
import Modal from "@/Components/Modal";

export default function Index({ slots = [], filters = {} }) {
    const { flash, errors } = usePage().props;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);

    // Create form
    const createForm = useForm({
        available_date: "",
        max_slots: 10,
        start_time: "09:00",
        end_time: "17:00",
        is_closed: false,
        notes: "",
    });

    // Edit form
    const editForm = useForm({
        max_slots: 10,
        start_time: "09:00",
        end_time: "17:00",
        is_closed: false,
        notes: "",
    });

    const openEdit = (slot) => {
        setEditingSlot(slot);
        editForm.setData({
            max_slots: slot.max_slots,
            start_time: slot.start_time ? slot.start_time.slice(0, 5) : "09:00",
            end_time: slot.end_time ? slot.end_time.slice(0, 5) : "17:00",
            is_closed: slot.is_closed,
            notes: slot.notes || "",
        });
        setShowEditModal(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route("slots.store"), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route("slots.update", editingSlot.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingSlot(null);
            },
        });
    };

    const deleteSlot = (slot) => {
        if (!confirm(`Delete slot for ${slot.available_date}?`)) return;
        router.delete(route("slots.destroy", slot.id));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <ClinicLayout>
            <Head title="Daily Slots" />

            <div className="mx-auto w-full max-w-[1600px] px-5 py-10 lg:px-16">
                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-clinic-blue/70">
                            Schedule
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-clinic-ink">
                            Daily Slots
                        </h1>
                        <p className="mt-1 text-[15px] text-slate-500">
                            Set how many patients the clinic will accept per day.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-clinic-navy px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-clinic-navy/90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Day Slot
                    </button>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] text-emerald-800">
                        {flash.success}
                    </div>
                )}
                {errors?.delete && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                        {errors.delete}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-clinic-line bg-white shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-clinic-line bg-slate-50/80 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Max Slots</th>
                                <th className="px-6 py-4">Booked</th>
                                <th className="px-6 py-4">Remaining</th>
                                <th className="px-6 py-4">Hours</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-clinic-line">
                            {slots.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                                        <CalendarDays className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                        <p className="text-[15px]">No daily slots set yet.</p>
                                        <p className="mt-1 text-[13px]">Click “Add Day Slot” to create one.</p>
                                    </td>
                                </tr>
                            )}

                            {slots.map((slot) => (
                                <tr key={slot.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-clinic-ink">
                                        {formatDate(slot.available_date)}
                                    </td>
                                    <td className="px-6 py-4">{slot.max_slots}</td>
                                    <td className="px-6 py-4">{slot.booked}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${
                                                slot.remaining === 0
                                                    ? "bg-red-50 text-red-700"
                                                    : slot.remaining <= 3
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-emerald-50 text-emerald-700"
                                            }`}
                                        >
                                            {slot.remaining} left
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[14px] text-slate-600">
                                        {slot.start_time && slot.end_time
                                            ? `${slot.start_time?.slice(0, 5)} – ${slot.end_time?.slice(0, 5)}`
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {slot.is_closed ? (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[12px] font-semibold text-slate-600">
                                                Closed
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700">
                                                Open
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(slot)}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-clinic-navy"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteSlot(slot)}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Create Modal ─────────────────────────────── */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="md">
                <form onSubmit={submitCreate} className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-clinic-ink">Add Daily Slot</h2>
                        <button type="button" onClick={() => setShowCreateModal(false)}>
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-[13px] font-semibold text-slate-600">Date</label>
                            <input
                                type="date"
                                value={createForm.data.available_date}
                                onChange={(e) => createForm.setData("available_date", e.target.value)}
                                className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px] focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                required
                            />
                            {createForm.errors.available_date && (
                                <p className="mt-1 text-[13px] text-red-600">{createForm.errors.available_date}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-[13px] font-semibold text-slate-600">
                                Max Patients (Slots)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={createForm.data.max_slots}
                                onChange={(e) => createForm.setData("max_slots", e.target.value)}
                                className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px] focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-600">Start Time</label>
                                <input
                                    type="time"
                                    value={createForm.data.start_time}
                                    onChange={(e) => createForm.setData("start_time", e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-600">End Time</label>
                                <input
                                    type="time"
                                    value={createForm.data.end_time}
                                    onChange={(e) => createForm.setData("end_time", e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-[13px] font-semibold text-slate-600">Notes (optional)</label>
                            <input
                                type="text"
                                value={createForm.data.notes}
                                onChange={(e) => createForm.setData("notes", e.target.value)}
                                placeholder="e.g. Half day only"
                                className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px]"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-[14px]">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_closed}
                                onChange={(e) => createForm.setData("is_closed", e.target.checked)}
                                className="rounded border-clinic-line"
                            />
                            Mark this day as Closed
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="rounded-xl px-4 py-2.5 text-[14px] font-medium text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="rounded-xl bg-clinic-navy px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60"
                        >
                            {createForm.processing ? "Saving..." : "Create Slot"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Edit Modal ───────────────────────────────── */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md">
                <form onSubmit={submitEdit} className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-clinic-ink">
                            Edit Slot – {editingSlot && formatDate(editingSlot.available_date)}
                        </h2>
                        <button type="button" onClick={() => setShowEditModal(false)}>
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-[13px] font-semibold text-slate-600">
                                Max Patients (Slots)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={editForm.data.max_slots}
                                onChange={(e) => editForm.setData("max_slots", e.target.value)}
                                className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px]"
                                required
                            />
                            {editForm.errors.max_slots && (
                                <p className="mt-1 text-[13px] text-red-600">{editForm.errors.max_slots}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-600">Start Time</label>
                                <input
                                    type="time"
                                    value={editForm.data.start_time}
                                    onChange={(e) => editForm.setData("start_time", e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-600">End Time</label>
                                <input
                                    type="time"
                                    value={editForm.data.end_time}
                                    onChange={(e) => editForm.setData("end_time", e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-[13px] font-semibold text-slate-600">Notes</label>
                            <input
                                type="text"
                                value={editForm.data.notes}
                                onChange={(e) => editForm.setData("notes", e.target.value)}
                                className="w-full rounded-xl border border-clinic-line px-4 py-2.5 text-[15px]"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-[14px]">
                            <input
                                type="checkbox"
                                checked={editForm.data.is_closed}
                                onChange={(e) => editForm.setData("is_closed", e.target.checked)}
                                className="rounded border-clinic-line"
                            />
                            Mark this day as Closed
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="rounded-xl px-4 py-2.5 text-[14px] font-medium text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="rounded-xl bg-clinic-navy px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60"
                        >
                            {editForm.processing ? "Saving..." : "Update Slot"}
                        </button>
                    </div>
                </form>
            </Modal>
        </ClinicLayout>
    );
}