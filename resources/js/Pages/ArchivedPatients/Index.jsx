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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Archived Patients</h2>}>
            <Head title="Archived Patients" />

            <div className="p-6">
                {props?.flash?.success && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{props.flash.success}</div>
                )}

                <div className="bg-white shadow-sm rounded-md overflow-hidden">
                    <table className="min-w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Age</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Contact</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                <th className="px-4 py-2" />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No archived patients.</td>
                                </tr>
                            )}
                            {items.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{a.patient_name}</td>
                                    <td className="px-4 py-3 text-sm">{a.age}</td>
                                    <td className="px-4 py-3 text-sm">{a.telephone}</td>
                                    <td className="px-4 py-3 text-sm">{a.patient_status}</td>
                                    <td className="px-4 py-3 text-sm text-right">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => { setSelected(a); setShowRestoreModal(true); }}
                                        >
                                            Restore
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal show={showRestoreModal} onClose={() => setShowRestoreModal(false)}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium">Restore patient</h3>
                        <p className="mt-2 text-sm text-gray-600">Restore <strong>{selected?.patient_name}</strong> back to active patients?</p>

                        <div className="mt-4 flex justify-end space-x-3">
                            <button onClick={() => setShowRestoreModal(false)} className="rounded-md border px-4 py-2">Cancel</button>
                            <form method="POST" action={selected ? route('archived-patients.restore', selected.id) : '#'}>
                                <input type="hidden" name="_token" value={csrfToken} />
                                <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Restore</button>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
