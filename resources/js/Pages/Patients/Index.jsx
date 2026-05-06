import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import InlineForm from './InlineForm';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ patients }) {
    const { props } = usePage();
    const patientsData = patients && patients.data ? patients.data : [];
    const csrfToken = props?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingPatient, setDeletingPatient] = useState(null);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Patients</h2>}>
            <Head title="Patients" />

            <div className="p-6">
                {props?.flash?.success && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{props.flash.success}</div>
                )}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Patients</h3>
                    <div>
                        <PrimaryButton onClick={() => { setEditingPatient(null); setShowModal(true); }}>Add Patient</PrimaryButton>
                    </div>
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
                                <tr key={p.id}>
                                    <td className="px-4 py-3 text-sm">{p.patient_name}</td>
                                    <td className="px-4 py-3 text-sm">{p.age}</td>
                                    <td className="px-4 py-3 text-sm">{p.occupation}</td>
                                    <td className="px-4 py-3 text-sm">{p.telephone}</td>
                                    <td className="px-4 py-3 text-sm">{p.email}</td>
                                    <td className="px-4 py-3 text-sm">{p.patient_status}</td>
                                    <td className="px-4 py-3 text-sm text-right">
                                        <Link href={route('patients.show', p.id)} className="text-indigo-600 hover:underline mr-3">View</Link>
                                        <button onClick={() => { setEditingPatient(p); setShowModal(true); }} className="text-blue-600 hover:underline mr-3">Edit</button>
                                        <button onClick={() => { setDeletingPatient(p); setShowDeleteModal(true); }} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                    <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">{editingPatient ? 'Edit Patient' : 'Add Patient'}</h3>
                        <InlineForm patient={editingPatient || {}} onSuccess={() => { setShowModal(false); router.reload(); }} />
                    </div>
                </Modal>

                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="md">
                    <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">Confirm delete</h3>
                        <p>Are you sure you want to delete <strong>{deletingPatient?.patient_name}</strong>?</p>
                        <div className="mt-4 flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                            <button onClick={() => {
                                if (!deletingPatient) return;
                                router.delete(route('patients.destroy', deletingPatient.id), {
                                    onSuccess: () => {
                                        setShowDeleteModal(false);
                                        setDeletingPatient(null);
                                        router.reload();
                                    }
                                });
                            }} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                        </div>
                    </div>
                </Modal>

                <div className="mt-4 text-sm text-gray-600">
                    {patients?.meta ? `Page ${patients.meta.current_page} of ${patients.meta.last_page}` : ''}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
