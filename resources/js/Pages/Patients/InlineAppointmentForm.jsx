import React from 'react';
import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function InlineAppointmentForm({ patientId, onSuccess = null }) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: patientId || '',
        complaint: '',
        service: '',
        date_of_visit: new Date().toISOString().slice(0,16), // datetime-local
        next_appointment: '',
        visit_status: 'pending',
        debit: 0,
        credit: 0,
    });

    React.useEffect(() => {
        if (patientId) setData('patient_id', patientId);
    }, [patientId]);

    function submit(e) {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: (page) => {
                if (onSuccess) onSuccess(page);
                else router.reload();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4 max-w-lg">
            <div>
                <InputLabel>Complaint</InputLabel>
                <TextInput value={data.complaint} onChange={(e) => setData('complaint', e.target.value)} className="mt-1 w-full" required />
                <InputError message={errors.complaint} />
            </div>

            <div>
                <InputLabel>Service</InputLabel>
                <TextInput value={data.service} onChange={(e) => setData('service', e.target.value)} className="mt-1 w-full" required />
                <InputError message={errors.service} />
            </div>

            <div>
                <InputLabel>Date of Visit</InputLabel>
                <input type="datetime-local" value={data.date_of_visit} onChange={(e) => setData('date_of_visit', e.target.value)} className="mt-1 w-full rounded-md border-gray-300" required />
                <InputError message={errors.date_of_visit} />
            </div>

            <div>
                <InputLabel>Next Appointment</InputLabel>
                <input type="datetime-local" value={data.next_appointment} onChange={(e) => setData('next_appointment', e.target.value)} className="mt-1 w-full rounded-md border-gray-300" />
                <InputError message={errors.next_appointment} />
            </div>

            <div>
                <InputLabel>Visit Status</InputLabel>
                <select value={data.visit_status} onChange={(e) => setData('visit_status', e.target.value)} className="mt-1 rounded-md border-gray-300 w-full">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <InputError message={errors.visit_status} />
            </div>

            <div className="flex space-x-2">
                <div className="flex-1">
                    <InputLabel>Debit</InputLabel>
                    <TextInput type="number" value={data.debit} onChange={(e) => setData('debit', e.target.value)} className="mt-1 w-full" />
                    <InputError message={errors.debit} />
                </div>
                <div className="flex-1">
                    <InputLabel>Credit</InputLabel>
                    <TextInput type="number" value={data.credit} onChange={(e) => setData('credit', e.target.value)} className="mt-1 w-full" />
                    <InputError message={errors.credit} />
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <PrimaryButton disabled={processing}>Create Appointment</PrimaryButton>
            </div>
        </form>
    );
}
