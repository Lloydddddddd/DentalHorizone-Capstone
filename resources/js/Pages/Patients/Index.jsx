import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import InlineForm from '@/Pages/Patients/InlineForm';
import AddAppointmentPopup from '@/Components/AddAppointmentPopup';

export default function Index({ patients }) {
    const { props } = usePage();
    const patientsData = patients && patients.data ? patients.data : [];
    const csrfToken = props?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [showApptModal, setShowApptModal] = useState(false);
    const [apptPatient, setApptPatient] = useState(null);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Patients</h2>}>
            <Head title="Patients" />

            <div className="p-6">
                {props?.flash?.success && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{props.flash.success}</div>
                )}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Patients</h3>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900`}
                    >
                        Add Patient
                    </button>
                </div>

                <div className="bg-white shadow-sm rounded-md overflow-hidden">
                    <table className="min-w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Age</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Occupation</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Contact</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                <th className="px-4 py-2" />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {patientsData.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No patients found.</td>
                                </tr>
                            )}
                            {patientsData.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{p.patient_name}</td>
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
                                    <td className="px-4 py-3 text-sm text-right">
                                        <button className="text-indigo-600 hover:underline mr-3" onClick={() => { setApptPatient(p); setShowApptModal(true); }}>Add Appointment</button>
                                        <button className="text-blue-600 hover:underline mr-3" onClick={() => { setEditingPatient(p); setShowEditModal(true); }}>Edit</button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => { setSelectedPatient(p); setShowArchiveModal(true); }}
                                        >
                                            Archive
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* debug info removed */}

                <Modal show={showArchiveModal} onClose={() => setShowArchiveModal(false)}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium">Archive patient</h3>
                        <p className="mt-2 text-sm text-gray-600">Are you sure you want to archive <strong>{selectedPatient?.patient_name}</strong>? This will move the patient to Archived Patients.</p>

                        <div className="mt-4 flex justify-end space-x-3">
                            <button onClick={() => setShowArchiveModal(false)} className="rounded-md border px-4 py-2">Cancel</button>
                            <form method="POST" action={selectedPatient ? route('patients.archive', selectedPatient.id) : '#'}>
                                <input type="hidden" name="_token" value={csrfToken} />
                                <button className="rounded-md bg-red-600 px-4 py-2 text-white">Archive</button>
                            </form>
                        </div>
                    </div>
                </Modal>

                <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium">Add Patient</h3>
                        <div className="mt-4">
                            <InlineForm onSuccess={() => { setShowAddModal(false); router.reload(); }} />
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
                    {patients?.meta ? `Page ${patients.meta.current_page} of ${patients.meta.last_page}` : ''}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
