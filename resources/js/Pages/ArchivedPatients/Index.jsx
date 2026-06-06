import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function ArchivedIndex({ archivedPatients }) {
    const { props } = usePage();
    const items = archivedPatients && archivedPatients.data ? archivedPatients.data : [];
    const csrfToken = props?.csrfToken || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [selected, setSelected] = useState(null);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Patients</h2>}>
            <Head title="Archived Patients" />

            <div className="p-6">
                {props?.flash?.success && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                        {props.flash.success}
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <Link
                        href={route('patients.index')}
                        className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 -mb-px"
                    >
                        Active Patients
                    </Link>
                    <Link
                        href={route('archived-patients.index')}
                        className="px-6 py-3 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600 -mb-px"
                    >
                        Archived Patients
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-md overflow-hidden">
                    <table className="min-w-full table-auto border border-gray-300 divide-y divide-gray-300">
                        <thead className="bg-orange-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">Age</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">Occupation</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">Contact</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">Email</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">Archived At</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No archived patients found.
                                    </td>
                                </tr>
                            ) : (
                                items.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-sm font-medium">{a.patient_name}</td>
                                        <td className="px-4 py-3 text-sm">{a.age}</td>
                                        <td className="px-4 py-3 text-sm">{a.occupation || '-'}</td>
                                        <td className="px-4 py-3 text-sm">{a.telephone}</td>
                                        <td className="px-4 py-3 text-sm">{a.email || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {a.created_at 
                                                ? new Date(a.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                  })
                                                : '-'
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-sm text-left space-x-4">
                                            <button
                                                onClick={() => { setSelected(a); setShowRestoreModal(true); }}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                            >
                                                Restore
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Restore Modal */}
                <Modal show={showRestoreModal} onClose={() => setShowRestoreModal(false)}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900">Restore Patient</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to restore <strong>{selected?.patient_name}</strong>?
                        </p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button 
                                onClick={() => setShowRestoreModal(false)} 
                                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <form 
                                method="POST" 
                                action={selected ? route('archived-patients.restore', selected.id) : '#'}
                            >
                                <input type="hidden" name="_token" value={csrfToken} />
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Restore Patient
                                </button>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}