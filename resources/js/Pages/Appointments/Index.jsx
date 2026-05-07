import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function Index({ appointments, filters }) {
    const handleSearchChange = (e) => {
        router.get(route('appointments.index'), { 
            search: e.target.value, 
            status: filters.status,
            sort: filters.sort,
            direction: filters.direction
        }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (e) => {
        router.get(route('appointments.index'), { 
            search: filters.search,
            status: e.target.value,
            sort: filters.sort,
            direction: filters.direction
        }, { preserveState: true, replace: true });
    };

    const handleSort = (column) => {
        const newDirection = filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('appointments.index'), { 
            search: filters.search,
            status: filters.status,
            sort: column,
            direction: newDirection
        }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Appointment Management Table</h2>}
        >
            <Head title="Appointments" />

            <div className="p-6 space-y-4">
                {/* 🔍 Search + Filter Bar */}
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search by patient name..."
                        defaultValue={filters.search || ''}
                        onChange={handleSearchChange}
                        className="border p-2 rounded w-1/3"
                    />
                    <select
                        defaultValue={filters.status || ''}
                        onChange={handleStatusChange}
                        className="border p-2 rounded"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* 📋 Table */}
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('date_of_visit')}>
                                Date of Visit {filters.sort === 'date_of_visit' ? (filters.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('next_appointment')}>
                                Next Appointment {filters.sort === 'next_appointment' ? (filters.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Complaint</th>
                            <th className="px-4 py-2 border">Service</th>
                            <th className="px-4 py-2 border">Visit Status</th>
                            <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('balance')}>
                                Balance {filters.sort === 'balance' ? (filters.direction === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th className="px-4 py-2 border">Debit</th>
                            <th className="px-4 py-2 border">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.data.map((appointment) => (
                            <tr key={appointment.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">
                                    {dayjs(appointment.date_of_visit).format('MMM D, YYYY h:mm A')}
                                </td>
                                <td className="px-4 py-2 border">
                                    {appointment.next_appointment
                                        ? dayjs(appointment.next_appointment).format('MMM D, YYYY h:mm A')
                                        : '-'}
                                </td>
                                <td className="px-4 py-2 border">{appointment.patient?.patient_name}</td>
                                <td className="px-4 py-2 border">{appointment.complaint}</td>
                                <td className="px-4 py-2 border">{appointment.service}</td>
                                <td className="px-4 py-2 border">{appointment.visit_status}</td>
                                <td className="px-4 py-2 border">{appointment.balance}</td>
                                <td className="px-4 py-2 border">{appointment.debit}</td>
                                <td className="px-4 py-2 border">{appointment.credit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 🔽 Pagination Links */}
                <div className="flex gap-2 mt-4">
                    {appointments.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-3 py-1 border rounded ${
                                link.active ? 'bg-blue-600 text-white' : 'bg-white'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}