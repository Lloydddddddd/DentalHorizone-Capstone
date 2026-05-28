import React, { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { TrashIcon } from '@heroicons/react/24/solid'

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
    const { data, setData, post, processing, errors, setErrors, reset } = useForm({
        patient_id: patient?.id || '',
        complaint: '',
        services: [{ id: '', note: '' }],
        date_of_visit: initialDate,
        next_appointment: '',
        no_next_appointment: false,
        visit_status: 'pending',
        debit: 0,
        credit: 0,
        balance: 0,
        note: '',
    });

    const firstInput = useRef(null);

    const [services, setServices] = useState([]);
    const [localErrors, setLocalErrors] = useState({});

    useEffect(() => {
        if (patient && patient.id) setData('patient_id', patient.id);
        setTimeout(() => firstInput.current?.focus(), 60);

        // Fetch services dynamically
        axios.get(route('services.list')).then(res => {
            setServices(res.data.services || []);
        }).catch(() => {
            setServices([]);
        });
    }, [patient]);

    const handleDebitChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setData('debit', value);

        // Balance always recalculated
        setData('balance', value - (parseFloat(data.credit) || 0));
    };

    const handleCreditChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setData('credit', value);

        // Always use current debit value
        const currentDebit = parseFloat(data.debit) || 0;
        setData('balance', currentDebit - value);
    };

    function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = {};

        // Complaint required
        if (!data.complaint || !data.complaint.trim()) {
            validationErrors.complaint = "Complaint is required.";
        }

        // At least one service required
        if (!data.services || data.services.length === 0) {
            validationErrors.services = "Please select at least one service.";
        }

        // Date of visit required
        if (!data.date_of_visit) {
            validationErrors.date_of_visit = "Date of visit is required.";
        }

        // Next appointment validation
        if (!data.no_next_appointment && !data.next_appointment) {
            validationErrors.next_appointment =
            "Next appointment date is required unless 'No next appointment' is checked.";
        }
        if (data.no_next_appointment && data.next_appointment) {
            validationErrors.next_appointment =
            "Clear the next appointment date if 'No next appointment' is checked.";
        }

        // Visit status required
        if (!data.visit_status) {
            validationErrors.visit_status = "Visit status is required.";
        }

        // Debit/Credit must be non-negative
        if (data.debit < 0) {
            validationErrors.debit = "Debit cannot be negative.";
        }
        if (data.credit < 0) {
            validationErrors.credit = "Credit cannot be negative.";
        }

        // If errors exist, stop submission
        if (Object.keys(validationErrors).length > 0) {
            setLocalErrors(validationErrors); // useForm will populate InputError
            return;
        }

        // Proceed with server request
        post(route('appointments.store'), {
            data: {
                patient_id: data.patient_id,
                complaint: data.complaint,
                date_of_visit: data.date_of_visit,
                next_appointment: data.next_appointment,
                no_next_appointment: data.no_next_appointment,
                visit_status: data.visit_status,
                debit: data.debit,
                credit: data.credit,
                balance: data.balance,
                note: data.note,
                services: data.services, // send array of {id, note}
            },
            onSuccess: (page) => {
                if (onSaved && typeof onSaved === 'function') onSaved(page);
                reset();
                onClose();
            },
            onError: (errors) => {
                // Laravel validation errors will automatically populate
                console.error("Server validation errors:", errors);
            }
        });
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Add Appointment</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel>Complaint</InputLabel>
                            <TextInput ref={firstInput} value={data.complaint} onChange={e => setData('complaint', e.target.value)} className="mt-1 w-full" required />
                            <InputError message={localErrors.complaint || errors.complaint} />
                        </div>

                        <div>
                            <InputLabel>Services</InputLabel>
                            {data.services.map((srv, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <select
                                        value={srv.id}
                                        onChange={(e) => {
                                        const selectedId = e.target.value;
                                        const updated = [...data.services];
                                        updated[index].id = selectedId;
                                        setData('services', updated);

                                        // Recalculate total debit from all selected services
                                        const totalDebit = updated.reduce((sum, s) => {
                                            const serviceObj = services.find(x => x.id == s.id);
                                            return sum + Number(serviceObj?.price || 0);
                                        }, 0);

                                        setData('debit', totalDebit);
                                        setData('balance', totalDebit - (parseFloat(data.credit) || 0));
                                        }}
                                        className="mt-1 w-full border rounded p-2"
                                        required
                                    >
                                        <option value="">Select a service</option>
                                        {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} (₱{service.price})
                                        </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Note"
                                        value={srv.note}
                                        onChange={(e) => {
                                        const updated = [...data.services];
                                        updated[index].note = e.target.value;
                                        setData('services', updated);
                                        }}
                                        className="border rounded p-2 flex-1"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = [...data.services];
                                            updated.splice(index, 1); // remove this service
                                            setData('services', updated);

                                            // Recalculate debit & balance after removal
                                            const totalDebit = updated.reduce((sum, s) => {
                                            const serviceObj = services.find(x => x.id == s.id);
                                            return sum + Number(serviceObj?.price || 0);
                                            }, 0);
                                            setData('debit', totalDebit);
                                            setData('balance', totalDebit - (parseFloat(data.credit) || 0));
                                        }}
                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => setData('services', [...data.services, { id: '', note: '' }])}
                                className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                                + Add Another Service
                            </button>

                            <InputError message={localErrors.services || errors.services} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel>Date of Visit</InputLabel>
                                <input type="datetime-local" value={data.date_of_visit} onChange={e => setData('date_of_visit', e.target.value)} className="mt-1 w-full rounded-md border-gray-300" required />
                                <InputError message={localErrors.date_of_visit || errors.date_of_visit} />
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
                                <InputError message={localErrors.next_appointment || errors.next_appointment} />

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
                            <InputError message={localErrors.visit_status || errors.visit_status} />
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
                                <InputError message={localErrors.debit || errors.debit} />
                            </div>
                            <div>
                                <InputLabel>Credit</InputLabel>
                                <TextInput
                                    type="number"
                                    value={data.credit}
                                    onChange={handleCreditChange}
                                    className="mt-1 w-full"
                                />
                                <InputError message={localErrors.credit || errors.credit} />
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
                            <InputError message={localErrors.balance || errors.balance} />
                        </div>

                        <div>
                            <InputLabel>Note</InputLabel>
                            <textarea
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                className="mt-1 w-full border rounded p-2"
                                rows="3"
                                placeholder="Additional notes..."
                            />
                            <InputError message={localErrors.note || errors.note} />
                        </div>

                        <div className="p-4 border-t flex justify-end gap-2">
                            <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <PrimaryButton type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}