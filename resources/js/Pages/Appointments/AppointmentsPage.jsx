import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import SearchFilter from '@/Components/SearchFilter';
import AppointmentsTable from '@/Pages/Appointments/AppointmentsTable';
import StatusFilter from "@/Components/StatusFilter";

export default function AppointmentsPage({ appointments, filters, title, routeName }) {
    const safeFilters = filters || {};

    const handleSearchChange = (e) => {
        router.get(route(routeName), { 
            search: e.target.value, 
            status: safeFilters.status,
            sort: safeFilters.sort,
            direction: safeFilters.direction
        }, { preserveState: true, replace: true });
    };

    // Truncate helpers
    function truncateComplaint(text, maxLength = 10) {
        if (!text) return '—';
        return text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
    }
    function truncateServices(text, maxLength = 10) {
        if (!text) return '—';
        return text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
    }
    function truncateNote(text, maxLength = 10) {
        if (!text) return '-';
        return text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
    }

    // Mapping logic
    const mappedAppointments = appointments.data.map((appointment) => ({
        id: appointment.id,
        // formatted for table
        date_of_visit: appointment.date_of_visit
        ? dayjs(appointment.date_of_visit).format('MMM D, YYYY h:mm A')
        : '–',
        next_appointment: appointment.next_appointment
            ? dayjs(appointment.next_appointment).format('MMM D, YYYY h:mm A')
            : '–',
        // raw values for editing (normalized for datetime-local)
        raw_date_of_visit: appointment.date_of_visit
            ? dayjs(appointment.date_of_visit).format('YYYY-MM-DDTHH:mm')
            : "",
        raw_next_appointment: appointment.next_appointment
            ? dayjs(appointment.next_appointment).format('YYYY-MM-DDTHH:mm')
            : null,
        patient_name: appointment.patient?.patient_name || '–',
        complaint: truncateComplaint(appointment.complaint),
        fullComplaint: appointment.complaint,
        service: truncateServices(
            appointment.services?.map(s => `${s.name}${s.pivot?.note ? ` (${s.pivot.note})` : ''}`).join(', ')
        ),
        fullService: appointment.services?.map(s => `${s.name}${s.pivot?.note ? ` (${s.pivot.note})` : ''}`).join(', '),
        raw_services: appointment.services || [],
        visit_status: appointment.visit_status,
        balance: appointment.balance,
        debit: appointment.debit,
        credit: appointment.credit,
        note: truncateNote(appointment.note),
        fullNote: appointment.note,
    }));

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{title}</h2>}
        >
            <Head title={title} />

            <div className="p-8 space-y-8 bg-gray-100">

                <div className="flex gap-1 ">
                    <div className="flex-1">
                    <SearchFilter
                        searchValue={safeFilters.search}
                        onSearchChange={handleSearchChange}
                    />
                    </div>

                    <StatusFilter
                    value={safeFilters.status}
                    onChange={(status) =>
                        router.get(route(routeName), {
                        search: safeFilters.search,
                        status,
                        sort: safeFilters.sort,
                        direction: safeFilters.direction,
                        }, { preserveState: true, replace: true })
                    }
                    />
                </div>

                <AppointmentsTable appointments={mappedAppointments} />

               <div className="flex gap-2 mt-4 justify-center">
                {appointments.links.map((link, index) => (
                    <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-3 py-1 text-sm font-medium border rounded-full transition-colors
                        ${
                        link.active
                            ? 'bg-blue-900 text-white border-gray-600'
                            : 'bg-white text-blue-900 border-orange-200 hover:bg-orange-50 hover:border-blue-600'
                        }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
                </div>


            </div>
        </AuthenticatedLayout>
    );
}