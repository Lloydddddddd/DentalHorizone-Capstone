import React from 'react';
import { useForm } from '@inertiajs/react';

export default function AddAppointmentPopup({ patient, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: patient.id,
        complaint: '',
        service: '',
        date_of_visit: '',
        next_appointment: '',
        visit_status: '',
        debit: 0,
        credit: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: () => {
                onClose(); // close popup after success
            },
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-[500px]">
                <h2 className="text-lg font-semibold mb-4">Add Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Complaint */}
                    <div>
                        <input
                            type="text"
                            value={data.complaint}
                            onChange={e => setData('complaint', e.target.value)}
                            placeholder="Complaint"
                            className="w-full border p-2"
                        />
                        {errors.complaint && (
                            <p className="text-red-600 text-sm mt-1">{errors.complaint}</p>
                        )}
                    </div>

                    {/* Service */}
                    <div>
                        <input
                            type="text"
                            value={data.service}
                            onChange={e => setData('service', e.target.value)}
                            placeholder="Service"
                            className="w-full border p-2"
                        />
                        {errors.service && (
                            <p className="text-red-600 text-sm mt-1">{errors.service}</p>
                        )}
                    </div>

                    {/* Date of Visit */}
                    <div>
                        <input
                            type="datetime-local"
                            value={data.date_of_visit}
                            onChange={e => setData('date_of_visit', e.target.value)}
                            className="w-full border p-2"
                        />
                        {errors.date_of_visit && (
                            <p className="text-red-600 text-sm mt-1">{errors.date_of_visit}</p>
                        )}
                    </div>

                    {/* Next Appointment */}
                    <div>
                        <input
                            type="datetime-local"
                            value={data.next_appointment}
                            onChange={e => setData('next_appointment', e.target.value)}
                            className="w-full border p-2"
                        />
                        {errors.next_appointment && (
                            <p className="text-red-600 text-sm mt-1">{errors.next_appointment}</p>
                        )}
                    </div>

                    {/* Visit Status */}
                    <div>
                        <input
                            type="text"
                            value={data.visit_status}
                            onChange={e => setData('visit_status', e.target.value)}
                            placeholder="Visit Status"
                            className="w-full border p-2"
                        />
                        {errors.visit_status && (
                            <p className="text-red-600 text-sm mt-1">{errors.visit_status}</p>
                        )}
                    </div>

                    {/* Debit */}
                    <div>
                        <input
                            type="number"
                            value={data.debit}
                            onChange={e => setData('debit', e.target.value)}
                            placeholder="Debit"
                            className="w-full border p-2"
                        />
                        {errors.debit && (
                            <p className="text-red-600 text-sm mt-1">{errors.debit}</p>
                        )}
                    </div>

                    {/* Credit */}
                    <div>
                        <input
                            type="number"
                            value={data.credit}
                            onChange={e => setData('credit', e.target.value)}
                            placeholder="Credit"
                            className="w-full border p-2"
                        />
                        {errors.credit && (
                            <p className="text-red-600 text-sm mt-1">{errors.credit}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}