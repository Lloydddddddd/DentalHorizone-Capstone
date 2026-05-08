import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import InlineForm from '@/Pages/Patients/InlineForm';
import AddAppointmentPopup from '@/Components/AddAppointmentPopup';

export default function Index({ patients, filters = {} }) {
    const { props } = usePage();
    const patientsData = patients && patients.data ? patients.data : [];
    const csrfToken = props?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const [search, setSearch] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showApptModal, setShowApptModal] = useState(false);
    const [apptPatient, setApptPatient] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(route('patients.index'), { 
                q: search || undefined, 
                status: statusFilter || undefined 
            }, { preserveState: true, replace: true });
        }, 500);

        return () => clearTimeout(handler);
    }, [search, statusFilter]);

    const openEditModal = (patient) => {
        setEditingPatient(patient);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        // Small delay before clearing to avoid visual glitch
        setTimeout(() => setEditingPatient(null), 300);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Patients</h2>}>
            <Head title="Patients" />

            <div className="p-6">
                {props?.flash?.success && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                        {props.flash.success}
                    </div>
                )}

                {/* Search and Add Button */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1 flex items-center space-x-3">
                        <form onSubmit={(e) => { e.preventDefault(); }} className="flex items-center space-x-2 w-full max-w-lg">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, phone, email or occupation"
                                className="w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:ring-indigo-500"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-md border px-3 py-2 text-sm focus:ring-indigo-500"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
                                Search
                            </button>
                        </form>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700 transition"
                    >
                        + Add Patient
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white shadow-sm rounded-md overflow-hidden">
                    <table className="min-w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Age</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Occupation</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contact</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {patientsData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No patients found.
                                    </td>
                                </tr>
                            ) : (
                                patientsData.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-sm font-medium">{p.patient_name}</td>
                                        <td className="px-4 py-3 text-sm">{p.age}</td>
                                        <td className="px-4 py-3 text-sm">{p.occupation}</td>
                                        <td className="px-4 py-3 text-sm">{p.telephone}</td>
                                        <td className="px-4 py-3 text-sm">{p.email}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {p.patient_status === 'Active' ? (
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">Active</span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right space-x-4">
                                            <button 
                                                onClick={() => { setApptPatient(p); setShowApptModal(true); }}
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                Appointment
                                            </button>
                                            <button 
                                                onClick={() => openEditModal(p)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setSelectedPatient(p); setShowArchiveModal(true); }}
                                                className="text-red-600 hover:text-red-800 hover:underline"
                                            >
                                                Archive
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Patient Modal */}
                <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Add New Patient</h3>
                        <div className="mt-4">
                            <InlineForm 
                                onSuccess={() => {
                                    setShowAddModal(false);
                                    router.reload({ only: ['patients'] });
                                }} 
                            />
                        </div>
                    </div>
                </Modal>

                {/* Edit Patient Modal */}
                <Modal show={showEditModal} onClose={closeEditModal}>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Edit Patient</h3>
                        <div className="mt-4">
                            <InlineForm 
                                patient={editingPatient}
                                onSuccess={() => {
                                    setShowEditModal(false);
                                    router.reload({ only: ['patients'] });
                                }} 
                            />
                        </div>
                    </div>
                </Modal>

                {/* Archive Modal */}
                <Modal show={showArchiveModal} onClose={() => setShowArchiveModal(false)}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium">Archive Patient</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to archive <strong>{selectedPatient?.patient_name}</strong>?
                        </p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button 
                                onClick={() => setShowArchiveModal(false)} 
                                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <form method="POST" action={selectedPatient ? route('patients.archive', selectedPatient.id) : '#'}>
                                <input type="hidden" name="_token" value={csrfToken} />
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                    Archive
                                </button>
                            </form>
                        </div>
                    </div>
                </Modal>

                {/* Appointment Popup */}
                {showApptModal && (
                    <AddAppointmentPopup
                        patient={apptPatient}
                        onClose={() => setShowApptModal(false)}
                        onSaved={() => router.reload()}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}