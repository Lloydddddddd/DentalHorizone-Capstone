import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Plus, Trash2, Pencil, CalendarDays, X, Clock, Users } from "lucide-react";
import ClinicLayout from "@/Layouts/ClinicLayout";
import Modal from "@/Components/Modal";

const FILTERS = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "closed", label: "Closed" },
    { key: "full", label: "Full" },
];

export default function Index({ slots = [], filters = {} }) {
    const { flash, errors } = usePage().props;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const createForm = useForm({
        available_date: "",
        max_slots: 10,
        start_time: "09:00",
        end_time: "17:00",
        is_closed: false,
        notes: "",
    });

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

    // Filter logic (mirrors Billing)
    const filteredSlots = slots.filter((slot) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "closed" && slot.is_closed) ||
            (activeTab === "open" && !slot.is_closed && slot.remaining > 0) ||
            (activeTab === "full" && !slot.is_closed && slot.remaining === 0);

        const haystack = `${slot.available_date} ${slot.notes || ""}`.toLowerCase();
        const matchesSearch = haystack.includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Shared status pill (matches Billing's getStatusPill)
    const getStatusPill = (slot) => {
        if (slot.is_closed) {
            return (
                <span className="inline-flex rounded-full px-3 py-1 text-[12px] font-semibold capitalize bg-slate-100 text-slate-600">
                    Closed
                </span>
            );
        }
        if (slot.remaining === 0) {
            return (
                <span className="inline-flex rounded-full px-3 py-1 text-[12px] font-semibold capitalize bg-[#fbe5e5] text-[#c14848]">
                    Full
                </span>
            );
        }
        if (slot.remaining <= 3) {
            return (
                <span className="inline-flex rounded-full px-3 py-1 text-[12px] font-semibold capitalize bg-[#fcefd7] text-[#a5620d]">
                    Limited
                </span>
            );
        }
        return (
            <span className="inline-flex rounded-full px-3 py-1 text-[12px] font-semibold capitalize bg-[#dcf2ec] text-[#1f7a63]">
                Open
            </span>
        );
    };

    return (
        <ClinicLayout>
            <Head title="Daily Slots" />

            <div className="mx-auto w-full max-w-[1600px] px-5 py-10 lg:px-16">
                {/* Header — matches Billing eyebrow + heading scale */}
                <div className="pb-8 flex justify-between items-end">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-clinic-accent">
                            Schedule
                        </p>
                        <h1 className="mt-3 text-[2.75rem] font-semibold leading-tight tracking-[-0.02em] text-clinic-ink">
                            Daily Slots
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-clinic-navy px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Day Slot
                    </button>
                </div>

                {/* Flash — matches Billing spacing/typography */}
                {flash?.success && (
                    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-[14px] text-emerald-800">
                        {flash.success}
                    </div>
                )}
                {errors?.delete && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-[14px] text-red-700">
                        {errors.delete}
                    </div>
                )}

                {/* Card */}
                <div className="rounded-2xl border border-clinic-line bg-white shadow-[0_1px_2px_rgba(15,31,51,0.04)]">
                    {/* Toolbar — mirrors Billing exactly */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-clinic-line px-7 py-5">
                        <div className="relative w-full max-w-md">
                            <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search date or notes..."
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
                                        onClick={() => setActiveTab(f.key)}
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

                    {/* Table — matches Billing header/cell rhythm */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-clinic-line text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                    <th className="px-7 py-4">Date</th>
                                    <th className="px-7 py-4 text-center">Max Slots</th>
                                    <th className="px-7 py-4 text-center">Booked</th>
                                    <th className="px-7 py-4 text-center">Remaining</th>
                                    <th className="px-7 py-4 text-center">Hours</th>
                                    <th className="px-7 py-4 text-center">Status</th>
                                    <th className="px-7 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#edf0f4]">
                                {filteredSlots.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-7 py-16 text-center text-slate-400">
                                            <CalendarDays className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                            <p className="text-[15px]">No daily slots found.</p>
                                            <p className="mt-1 text-[13px]">
                                                Click “Add Day Slot” to create one.
                                            </p>
                                        </td>
                                    </tr>
                                )}

                                {filteredSlots.map((slot) => (
                                    <tr
                                        key={slot.id}
                                        className="transition-colors hover:bg-slate-50/70"
                                    >
                                        <td className="px-7 py-5">
                                            <p className="text-[15px] font-semibold text-clinic-ink">
                                                {formatDate(slot.available_date)}
                                            </p>
                                            {slot.notes && (
                                                <p className="text-[13px] text-slate-500">{slot.notes}</p>
                                            )}
                                        </td>
                                        <td className="px-7 py-5 text-center text-[14px] text-slate-600">
                                            {slot.max_slots}
                                        </td>
                                        <td className="px-7 py-5 text-center text-[14px] text-slate-600">
                                            {slot.booked}
                                        </td>
                                        <td className="px-7 py-5 text-center">
                                            <span
                                                className={`text-[14px] font-semibold ${
                                                    slot.remaining === 0
                                                        ? "text-[#c14848]"
                                                        : "text-clinic-ink"
                                                }`}
                                            >
                                                {slot.remaining}
                                            </span>
                                        </td>
                                        <td className="px-7 py-5 text-center text-[14px] text-slate-600">
                                            {slot.start_time && slot.end_time
                                                ? `${slot.start_time?.slice(0, 5)} – ${slot.end_time?.slice(0, 5)}`
                                                : "—"}
                                        </td>
                                        <td className="px-7 py-5 text-center">
                                            {getStatusPill(slot)}
                                        </td>
                                        <td className="px-7 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEdit(slot)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-clinic-line bg-white px-4 py-2 text-[13px] font-semibold text-clinic-ink transition hover:border-clinic-blue hover:bg-slate-50"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteSlot(slot)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-[#fbe5e5] px-4 py-2 text-[13px] font-semibold text-[#c14848] transition hover:bg-[#f8d7d7]"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
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

            {/* ── Create Modal (Billing-style header + footer bar) ── */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                maxWidth="md"
                closeable={false}
            >
                <form onSubmit={submitCreate} className="flex flex-col">
                    <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                        <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0fb] text-clinic-blue">
                                <CalendarDays className="h-6 w-6" />
                            </span>
                            <div>
                                <h2 className="text-[20px] font-semibold text-clinic-ink">
                                    Add Daily Slot
                                </h2>
                                <p className="mt-1 text-[14px] text-slate-500">
                                    Define availability for a single clinic day.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-8 py-6 space-y-5">
                        <div>
                            <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                Date
                            </label>
                            <input
                                type="date"
                                value={createForm.data.available_date}
                                onChange={(e) => createForm.setData("available_date", e.target.value)}
                                className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                required
                            />
                            {createForm.errors.available_date && (
                                <p className="mt-1 text-[13px] text-red-600">
                                    {createForm.errors.available_date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                Max Patients (Slots)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={createForm.data.max_slots}
                                onChange={(e) => createForm.setData("max_slots", e.target.value)}
                                className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={createForm.data.start_time}
                                    onChange={(e) => createForm.setData("start_time", e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={createForm.data.end_time}
                                    onChange={(e) => createForm.setData("end_time", e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                Notes (optional)
                            </label>
                            <input
                                type="text"
                                value={createForm.data.notes}
                                onChange={(e) => createForm.setData("notes", e.target.value)}
                                placeholder="e.g. Half day only"
                                className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-[14px] text-slate-600">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_closed}
                                onChange={(e) => createForm.setData("is_closed", e.target.checked)}
                                className="rounded border-clinic-line"
                            />
                            Mark this day as Closed
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-clinic-line bg-slate-50/60 px-8 py-5">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="rounded-xl border border-clinic-line bg-white px-6 py-2.5 text-[14px] font-semibold text-clinic-ink hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="rounded-xl bg-clinic-navy px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#0f3a5c] disabled:opacity-50"
                        >
                            {createForm.processing ? "Saving..." : "Create Slot"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Edit Modal ── */}
            <Modal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                maxWidth="md"
                closeable={false}
            >
                <form onSubmit={submitEdit} className="flex flex-col">
                    <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                        <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0fb] text-clinic-blue">
                                <Clock className="h-6 w-6" />
                            </span>
                            <div>
                                <h2 className="text-[20px] font-semibold text-clinic-ink">
                                    Edit Slot
                                </h2>
                                <p className="mt-1 text-[14px] text-slate-500">
                                    {editingSlot && formatDate(editingSlot.available_date)}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-8 py-6 space-y-5">
                        <div>
                            <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                Max Patients (Slots)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={editForm.data.max_slots}
                                onChange={(e) => editForm.setData("max_slots", e.target.value)}
                                className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                required
                            />
                            {editForm.errors.max_slots && (
                                <p className="mt-1 text-[13px] text-red-600">
                                    {editForm.errors.max_slots}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={editForm.data.start_time}
                                    onChange={(e) => editForm.setData("start_time", e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={editForm.data.end_time}
                                    onChange={(e) => editForm.setData("end_time", e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                                Notes
                            </label>
                            <input
                                type="text"
                                value={editForm.data.notes}
                                onChange={(e) => editForm.setData("notes", e.target.value)}
                                className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-[14px] text-slate-600">
                            <input
                                type="checkbox"
                                checked={editForm.data.is_closed}
                                onChange={(e) => editForm.setData("is_closed", e.target.checked)}
                                className="rounded border-clinic-line"
                            />
                            Mark this day as Closed
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-clinic-line bg-slate-50/60 px-8 py-5">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="rounded-xl border border-clinic-line bg-white px-6 py-2.5 text-[14px] font-semibold text-clinic-ink hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="rounded-xl bg-clinic-navy px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#0f3a5c] disabled:opacity-50"
                        >
                            {editForm.processing ? "Saving..." : "Update Slot"}
                        </button>
                    </div>
                </form>
            </Modal>
        </ClinicLayout>
    );
}