import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Form({ patient }) {
    const isNew = !patient || !patient.id;
    const { data, setData, post, put, processing, errors } = useForm({
        patient_name: patient?.patient_name || '',
        age: patient?.age || '',
        occupation: patient?.occupation || '',
        telephone: patient?.telephone || '',
        address: patient?.address || '',
        email: patient?.email || '',
        patient_status: patient?.patient_status || 'Active',
    });

    function submit(e) {
        e.preventDefault();
        if (isNew) {
            post(route('patients.store'), {
                onSuccess: () => router.visit(route('patients.index')),
            });
        } else {
            put(route('patients.update', patient.id), {
                onSuccess: () => router.visit(route('patients.index')),
            });
        }
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">{isNew ? 'Add' : 'Edit'} Patient</h2>}>
            <Head title={isNew ? 'Add Patient' : 'Edit Patient'} />

            <form onSubmit={submit} className="p-6 max-w-2xl space-y-4 bg-white rounded-md shadow-sm">
                <div>
                    <InputLabel>Name</InputLabel>
                    <TextInput value={data.patient_name} onChange={(e) => setData('patient_name', e.target.value)} className="mt-1 w-full" required />
                    <InputError message={errors.patient_name} />
                </div>

                <div>
                    <InputLabel>Age</InputLabel>
                    <TextInput type="number" value={data.age} onChange={(e) => setData('age', e.target.value)} className="mt-1 w-40" />
                    <InputError message={errors.age} />
                </div>

                <div>
                    <InputLabel>Occupation</InputLabel>
                    <TextInput value={data.occupation} onChange={(e) => setData('occupation', e.target.value)} className="mt-1 w-full" />
                    <InputError message={errors.occupation} />
                </div>

                <div>
                    <InputLabel>Contact Number</InputLabel>
                    <TextInput value={data.telephone} onChange={(e) => setData('telephone', e.target.value)} className="mt-1 w-full" />
                    <InputError message={errors.telephone} />
                </div>

                <div>
                    <InputLabel>Email</InputLabel>
                    <TextInput type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 w-full" />
                    <InputError message={errors.email} />
                </div>

                <div>
                    <InputLabel>Address</InputLabel>
                    <TextInput value={data.address} onChange={(e) => setData('address', e.target.value)} className="mt-1 w-full" />
                    <InputError message={errors.address} />
                </div>

                <div>
                    <InputLabel>Patient Status</InputLabel>
                    <select value={data.patient_status} onChange={(e) => setData('patient_status', e.target.value)} className="mt-1 rounded-md border-gray-300">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <InputError message={errors.patient_status} />
                </div>

                <div className="mt-4">
                    <PrimaryButton disabled={processing}>{isNew ? 'Create' : 'Save'}</PrimaryButton>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
