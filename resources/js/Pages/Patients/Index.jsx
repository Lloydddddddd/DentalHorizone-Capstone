import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InlineForm from "@/Pages/Patients/InlineForm";
import AddAppointmentPopup from "@/Components/AddAppointmentPopup";
import SearchFilter from "@/Components/SearchFilter";

export default function Index({ patients, totalPatients }) {
    const { props } = usePage();
    const patientsData = patients && patients.data ? patients.data : [];
    const csrfToken =
        props?.csrfToken ||
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const [showApptModal, setShowApptModal] = useState(false);
    const [apptPatient, setApptPatient] = useState(null);

    // Search functionality
    const [search, setSearch] = useState(props?.q || "");
    const [sort, setSort] = useState(props?.sort || "name");

    // Debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(
                route("patients.index"),
                { q: search || undefined, sort: sort || undefined },
                {
                    preserveState: true,
                    replace: true,
                    only: ["patients", "flash"],
                },
            );
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSort(value);
        router.get(
            route("patients.index"),
            { q: search || undefined, sort: value || undefined },
            {
                preserveState: true,
                replace: true,
                only: ["patients", "flash"],
            },
        );
    };

    const openEditModal = (patient) => {
        setEditingPatient(patient);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setTimeout(() => setEditingPatient(null), 300);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">Patients</h2>
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                        {totalPatients ?? 0} total
                    </span>
                </div>
            }
        >
            <Head title="Patients" />

            <div className="p-6">
                {props?.flash?.success && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                        {props.flash.success}
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <Link
                        href={route("patients.index")}
                        className="px-6 py-3 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600 -mb-px"
                    >
                        Active Patients
                    </Link>
                    <Link
                        href={route("archived-patients.index")}
                        className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 -mb-px"
                    >
                        Archived Patients
                    </Link>
                </div>

                {/* Search + Add Button */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex-1 flex items-center space-x-3">
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex items-center space-x-2 flex-1"
                        >
                            <SearchFilter
                                searchValue={search}
                                onSearchChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                value={sort}
                                onChange={handleSortChange}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
                            >
                                <option value="name">Name (A–Z)</option>
                                <option value="name_desc">Name (Z–A)</option>
                                <option value="date">Date Added</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 transition"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Add Patient */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`inline-flex items-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900`}
                    >
                        Add Patient
                    </button>
                </div>

                <div className="bg-white shadow-sm rounded-md overflow-hidden">
                    <table className="min-w-full table-auto border border-gray-300">
                        <thead className="bg-orange-50">
                            <tr>
                                <th className="px-6 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">
                                    Age
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">
                                    Occupation
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400 ">
                                    Contact
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">
                                    Email
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">
                                    Status
                                </th>
                                <th className="px-5 py-2 text-center text-xs font-bold text-blue-900 border-b-2 border-orange-400">
                                Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                            {patientsData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No patients found.
                                    </td>
                                </tr>
                            )}

                            {patientsData.map((p) => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-3 text-sm font-medium">
                                        {p.patient_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {p.age}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {p.occupation || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {p.telephone}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {p.email}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    
                                    <td className="px-4 py-3 text-sm text-right space-x-4">
                                        <button
                                            onClick={() => {
                                                setApptPatient(p);
                                                setShowApptModal(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                        >
                                            Appointment
                                        </button>
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="text-green-700 hover:text-green-800 hover:underline font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedPatient(p);
                                                setShowArchiveModal(true);
                                            }}
                                            className="text-red-600 hover:text-red-800 hover:underline"
                                        >
                                            Archive
                                        </button>
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal
                    show={showArchiveModal}
                    onClose={() => setShowArchiveModal(false)}
                >
                    <div className="p-6">
                        <h3 className="text-lg font-medium">Archive patient</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to archive{" "}
                            <strong>{selectedPatient?.patient_name}</strong>?
                            This will move the patient to Archived Patients.
                        </p>

                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowArchiveModal(false)}
                                className="rounded-md border px-4 py-2"
                            >
                                Cancel
                            </button>
                            <form
                                method="POST"
                                action={
                                    selectedPatient
                                        ? route(
                                              "patients.archive",
                                              selectedPatient.id,
                                          )
                                        : "#"
                                }
                            >
                                <input
                                    type="hidden"
                                    name="_token"
                                    value={csrfToken}
                                />
                                <button className="rounded-md bg-red-600 px-4 py-2 text-white">
                                    Archive
                                </button>
                            </form>
                        </div>
                    </div>
                </Modal>

                <Modal
                    show={showAddModal}
                    onClose={() => setShowAddModal(false)}
                >
                    <div className="p-6">
                        <h3 className="text-lg font-medium">Add Patient</h3>
                        <div className="mt-4">
                            <InlineForm
                                onSuccess={() => {
                                    setShowAddModal(false);
                                    router.reload();
                                }}
                            />
                        </div>
                    </div>
                </Modal>

                <Modal show={showEditModal} onClose={closeEditModal}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium">Edit Patient</h3>
                        <div className="mt-4">
                            <InlineForm
                                patient={editingPatient}
                                onSuccess={() => {
                                    closeEditModal();
                                    router.reload();
                                }}
                            />
                        </div>
                    </div>
                </Modal>

                {showApptModal && (
                    <AddAppointmentPopup
                        patient={apptPatient}
                        onClose={() => setShowApptModal(false)}
                        onSaved={() => router.reload()}
                    />
                )}

                <div className="mt-4 text-sm text-gray-600">
                    {patients?.meta
                        ? `Page ${patients.meta.current_page} of ${patients.meta.last_page}`
                        : ""}
                </div>

                

                {/* Edit modal placeholder removed (kept HEAD behavior: controller-based edit exists elsewhere) */}
            </div>
        </AuthenticatedLayout>
    );
}
