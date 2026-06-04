import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ patient }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Patient Details</h2>}>
            <Head title={`Patient: ${patient.patient_name}`} />

            <div className="p-6 max-w-3xl">
                <div className="mb-4">
                    <strong>Name:</strong> {patient.patient_name}
                </div>
                <div className="mb-4"><strong>Age:</strong> {patient.age}</div>
                <div className="mb-4"><strong>Occupation:</strong> {patient.occupation}</div>
                <div className="mb-4"><strong>Contact:</strong> {patient.telephone}</div>
                <div className="mb-4"><strong>Email:</strong> {patient.email}</div>
                <div className="mb-4"><strong>Address:</strong> {patient.address}</div>
                <div className="mb-4"><strong>Patient Status:</strong> Active</div>
            </div>
        </AuthenticatedLayout>
    );
}
