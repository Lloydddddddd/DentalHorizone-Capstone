import React, { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

function formatDatetimeLocal(date = new Date()) {
    // returns YYYY-MM-DDTHH:MM suitable for <input type="datetime-local">
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function AddAppointmentPopup({ patient = null, onClose = () => {}, onSaved = null }) {
    const initialDate = formatDatetimeLocal();
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: patient?.id || '',
        complaint: '',
        service: '',
        date_of_visit: initialDate,
        next_appointment: '',
        no_next_appointment: false,
        visit_status: 'pending',
        debit: 0,
        credit: 0,
        balance: 0,
    });

    const firstInput = useRef(null);

    useEffect(() => {
        if (patient && patient.id) setData('patient_id', patient.id);
        // focus first input when opened
        setTimeout(() => firstInput.current?.focus(), 60);
    }, [patient]);

    const services = {
    "Consultation": 500,
    "Cleaning / Prophylaxis": 1000,
    "Tooth Extraction": 1000,
    "Tooth Filling": 1000,
    "Veneers": 5000,
    "Jacket Crown": 5000,
    "Retainer": 3000,
    "Plastic Denture": 1000,
    "Full Denture": 1500,
    };

    const handleDebitChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setData('debit', value);
    setData('balance', value - (parseFloat(data.credit) || 0));
    };

    const handleCreditChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setData('credit', value);
    setData('balance', (parseFloat(data.debit) || 0) - value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: (page) => {
                if (onSaved && typeof onSaved === 'function') onSaved(page);
                reset();
                onClose();
            },
        });
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">Add Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <InputLabel>Complaint</InputLabel>
                        <TextInput ref={firstInput} value={data.complaint} onChange={e => setData('complaint', e.target.value)} className="mt-1 w-full" required />
                        <InputError message={errors.complaint} />
                    </div>

                    <div>
                        <InputLabel>Service</InputLabel>
                        <select
                            value={data.service}
                            onChange={(e) => {
                                const selectedService = e.target.value;
                                const price = services[selectedService] || 0;
                                setData('service', selectedService);
                                setData('debit', price);
                                setData('balance', price - (parseFloat(data.credit) || 0));
                            }}
                            className="mt-1 w-full border rounded p-2"
                            required
                        >
                            <option value="">Select a service</option>
                            {Object.keys(services).map((service) => (
                                <option key={service} value={service}>
                                    {service}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.service} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel>Date of Visit</InputLabel>
                            <input type="datetime-local" value={data.date_of_visit} onChange={e => setData('date_of_visit', e.target.value)} className="mt-1 w-full rounded-md border-gray-300" required />
                            <InputError message={errors.date_of_visit} />
                        </div>

                        <div>
                            <InputLabel>Next Appointment</InputLabel>
                            <input
                                type="datetime-local"
                                value={data.next_appointment}
                                onChange={(e) => setData('next_appointment', e.target.value)}
                                className="mt-1 w-full rounded-md border-gray-300"
                                disabled={data.no_next_appointment}   //disable if checkbox checked
                            />
                            <InputError message={errors.next_appointment} />

                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.no_next_appointment}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setData('no_next_appointment', checked);
                                        if (checked) {
                                            setData('next_appointment', ''); //clear value
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-600">No next appointment</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <InputLabel>Visit Status</InputLabel>
                        <select value={data.visit_status} onChange={e => setData('visit_status', e.target.value)} className="mt-1 rounded-md border-gray-300 w-full">
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <InputError message={errors.visit_status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel>Debit</InputLabel>
                            <TextInput
                                type="number"
                                value={data.debit}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setData('debit', value);
                                    setData('balance', value - (parseFloat(data.credit) || 0));
                                }}
                                className="mt-1 w-full"
                            />
                            <InputError message={errors.debit} />
                        </div>
                        <div>
                            <InputLabel>Credit</InputLabel>
                            <TextInput
                                type="number"
                                value={data.credit}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setData('credit', value);
                                    setData('balance', (parseFloat(data.debit) || 0) - value);
                                }}
                                className="mt-1 w-full"
                            />
                            <InputError message={errors.credit} />
                        </div>
                    </div>

                    <div>
                        <InputLabel>Balance</InputLabel>
                        <TextInput
                            type="number"
                            value={data.balance}
                            readOnly
                            className={`mt-1 w-full bg-gray-100 ${
                                data.balance < 0 ? 'text-red-600' : 'text-green-600'
                            }`}
                        />
                        <InputError message={errors.balance} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                        <PrimaryButton disabled={processing}>{processing ? 'Saving...' : 'Save'}</PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}