import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Upcoming({ auth, appointments, filters }) {
    function handleSearch(e) {
        router.get(route('appointments.upcoming'), { 
            search: e.target.value, 
            status: filters.status 
        }, { preserveState: true });
    }

    function handleStatus(e) {
        router.get(route('appointments.upcoming'), { 
            search: filters.search, 
            status: e.target.value 
        }, { preserveState: true });
    }

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Upcoming Appointments</h2>}>
            <Head title="Upcoming Appointments" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg p-6">

                    {/* Search + Filter */}
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search by patient name..."
                            defaultValue={filters.search}
                            onChange={handleSearch}
                            className="border rounded px-3 py-2 w-1/2"
                        />
                        <select
                            defaultValue={filters.status}
                            onChange={handleStatus}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="missed">Missed</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Table */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th>Date of Visit</th>
                                <th>Next Appointment</th>
                                <th>Name</th>
                                <th>Complaint</th>
                                <th>Service</th>
                                <th>Visit Status</th>
                                <th>Balance</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.data.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>{appointment.date_of_visit}</td>
                                    <td>{appointment.next_appointment 
                                        ? new Date(appointment.next_appointment).toLocaleString('en-PH', { 
                                            year: 'numeric', month: 'short', day: 'numeric', 
                                            hour: '2-digit', minute: '2-digit' 
                                            }) 
                                        : '-'}</td>
                                    <td>{appointment.patient?.patient_name}</td>
                                    <td>{appointment.complaint}</td>
                                    <td>{appointment.service}</td>
                                    <td>{appointment.visit_status}</td>
                                    <td>{appointment.balance}</td>
                                    <td>{appointment.debit}</td>
                                    <td>{appointment.credit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4 flex gap-2">
                        {appointments.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-1 rounded ${
                                    link.active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}