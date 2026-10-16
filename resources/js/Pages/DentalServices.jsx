import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Plus, Edit3, Trash2, X } from "lucide-react";
import ClinicLayout from "@/Layouts/ClinicLayout";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

/* ── Tooth icon (reused by cards + modals) ─────────────────────────── */
function ToothIcon(props) {
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
            <path d="M12 3.5c-1.6-1.3-5.5-1.8-7 1.2-1.2 2.4-.2 5.1.7 7.2.7 1.7.8 3.6 1.2 5.4.3 1.2 1.1 2 2 2 1.2 0 1.7-1.5 2.1-3 .2-.8.5-1.3 1-1.3s.8.5 1 1.3c.4 1.5.9 3 2.1 3 .9 0 1.7-.8 2-2 .4-1.8.5-3.7 1.2-5.4.9-2.1 1.9-4.8.7-7.2-1.5-3-5.4-2.5-7-1.2z" />
        </svg>
    );
}

/* ── Deterministic tile accents (cycles across the catalog) ───────── */
const TILE_TONES = [
    "bg-[#eaf0fb] text-clinic-blue",
    "bg-[#e6f6f2] text-[#1f9d7e]",
    "bg-[#fdf1e1] text-[#e98b2a]",
    "bg-[#f0ebf9] text-[#6b4fb3]",
    "bg-[#fde8e8] text-[#d94a4a]",
];

export default function DentalServices() {
    const { services = [] } = usePage().props;

    const [showFormModal, setShowFormModal] = useState(false);
    const [editing, setEditing] = useState(null); // null = add, object = edit

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const openAdd = () => {
        setEditing(null);
        setShowFormModal(true);
    };

    const openEdit = (service) => {
        setEditing(service);
        setShowFormModal(true);
    };

    const openDelete = (service) => {
        setDeleting(service);
        setShowDeleteModal(true);
    };

    return (
        <ClinicLayout>
            <Head title="Dental Services" />

            <div className="mx-auto w-full max-w-[1600px] px-5 py-10 lg:px-16">
                {/* ── Page header ───────────────────────────────────── */}
                <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-clinic-accent">
                            Clinic Catalog
                        </p>
                        <h1 className="mt-3 text-[2.75rem] font-semibold leading-tight tracking-[-0.02em] text-clinic-ink">
                            Dental services
                        </h1>
                        <p className="mt-3 text-[16px] text-slate-500">
                            Manage available treatments and care options.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAdd}
                        className="flex items-center gap-2.5 rounded-xl bg-clinic-navy px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c]"
                    >
                        <Plus className="h-5 w-5" />
                        Add service
                    </button>
                </div>

                {/* ── Service grid ──────────────────────────────────── */}
                {services.length === 0 ? (
                    <div className="rounded-2xl border border-clinic-line bg-white px-8 py-20 text-center shadow-[0_1px_2px_rgba(15,31,51,0.04)]">
                        <p className="text-[16px] font-medium text-slate-500">
                            No services yet
                        </p>
                        <p className="mt-1 text-[14px] text-slate-400">
                            Add your first treatment to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {services.map((service, index) => {
                            const tone = TILE_TONES[index % TILE_TONES.length];

                            return (
                                <article
                                    key={service.id}
                                    className="flex items-center gap-5 rounded-2xl border border-clinic-line bg-white px-7 py-6 shadow-[0_1px_2px_rgba(15,31,51,0.04)]"
                                >
                                    {/* Icon */}
                                    <span
                                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tone}`}
                                    >
                                        <ToothIcon className="h-6 w-6" />
                                    </span>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-[17px] font-semibold text-clinic-ink">
                                            {service.name}
                                        </h2>
                                        <p className="mt-1 truncate text-[14px] text-slate-500">
                                            {service.description || "No description"}
                                        </p>
                                        <p className="mt-2 text-[15px] font-bold text-clinic-ink">
                                            ₱{Number(service.price).toLocaleString("en-PH")}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(service)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-clinic-line bg-white px-4 py-2 text-[13px] font-semibold text-clinic-ink transition hover:border-clinic-blue hover:bg-slate-50"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openDelete(service)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-[13px] font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Add / Edit Service Modal ──────────────────────────── */}
            <ServiceFormModal
                show={showFormModal}
                onClose={() => setShowFormModal(false)}
                service={editing}
            />

            {/* ── Delete Service Modal ──────────────────────────────── */}
            <DeleteServiceModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                service={deleting}
            />
        </ClinicLayout>
    );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Add / Edit modal                                                     */
/* ─────────────────────────────────────────────────────────────────── */
function ServiceFormModal({ show, onClose, service }) {
    const isEdit = !!service;
    const { errors } = usePage().props;

    const [data, setDataState] = useState({
        name: "",
        description: "",
        price: "",
    });
    const [processing, setProcessing] = useState(false);

    // Reset form whenever the modal opens
    React.useEffect(() => {
        if (show) {
            setDataState({
                name: service?.name ?? "",
                description: service?.description ?? "",
                price: service?.price ?? "",
            });
        }
    }, [show, service]);

    const setData = (key, value) => {
        setDataState((prev) => ({ ...prev, [key]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const url = isEdit
            ? route("services.update", service.id)
            : route("services.store");

        const method = isEdit ? "put" : "post";

        router[method](url, data, {
            onSuccess: () => {
                setProcessing(false);
                onClose();
            },
            onError: () => setProcessing(false),
        });
    };

    const labelClass = "mb-2 block text-[13px] font-semibold text-clinic-ink";

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fdf1e1] text-clinic-accent">
                        <ToothIcon className="h-6 w-6" />
                    </span>
                    <div>
                        <h2 className="text-[20px] font-semibold text-clinic-ink">
                            {isEdit ? "Edit service" : "Add service"}
                        </h2>
                        <p className="mt-1 text-[14px] text-slate-500">
                            {isEdit
                                ? "Update this treatment's information."
                                : "Create a new treatment for your clinic catalog."}
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
            <form onSubmit={submit} className="px-8 py-7">
                <div className="space-y-5">
                    <div>
                        <label className={labelClass}>Service name</label>
                        <TextInput
                            variant="clinic"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter service name"
                            required
                            disabled={processing}
                        />
                        <InputError
                            message={errors?.name}
                            className="mt-1.5 text-[12px]"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            placeholder="Add a short description of this service"
                            rows={4}
                            disabled={processing}
                            className="w-full rounded-xl border border-clinic-line bg-white px-4 py-3 text-[15px] text-clinic-ink placeholder:text-slate-400 focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15 disabled:bg-slate-50"
                        />
                        <InputError
                            message={errors?.description}
                            className="mt-1.5 text-[12px]"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Price</label>
                        <TextInput
                            variant="clinic"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            placeholder="Enter service price"
                            required
                            disabled={processing}
                        />
                        <InputError
                            message={errors?.price}
                            className="mt-1.5 text-[12px]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-clinic-line pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-clinic-line bg-white px-6 py-3 text-[14px] font-semibold text-clinic-ink transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-clinic-navy px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c] disabled:opacity-60"
                    >
                        <ToothIcon className="h-4 w-4" />
                        {processing
                            ? "Saving..."
                            : isEdit
                              ? "Save changes"
                              : "Save service"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Delete confirmation modal                                            */
/* ─────────────────────────────────────────────────────────────────── */
function DeleteServiceModal({ show, onClose, service }) {
    const [processing, setProcessing] = useState(false);

    const confirm = () => {
        if (!service) return;
        setProcessing(true);
        router.delete(route("services.destroy", service.id), {
            onSuccess: () => {
                setProcessing(false);
                onClose();
            },
            onError: () => setProcessing(false),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fde8e8] text-[#d94a4a]">
                        <ToothIcon className="h-6 w-6" />
                    </span>
                    <div>
                        <h2 className="text-[20px] font-semibold text-clinic-ink">
                            Delete this service?
                        </h2>
                        <p className="mt-1 text-[14px] text-slate-500">
                            This will remove it from your clinic catalog.
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
                <p className="text-[15px] leading-relaxed text-slate-600">
                    <strong className="text-clinic-ink">
                        {service?.name}
                    </strong>{" "}
                    will no longer be available as a treatment option. This
                    action cannot be undone.
                </p>
            </div>

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
                    onClick={confirm}
                    disabled={processing}
                    className="rounded-xl bg-[#d94a4a] px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#c03f3f] disabled:opacity-60"
                >
                    {processing ? "Deleting..." : "Delete service"}
                </button>
            </div>
        </Modal>
    );
}