import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import StatsCard from "@/Pages/Dashboard/Components/StatsCard";
import ScheduleTable from "@/Pages/Dashboard/Components/ScheduleTable";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import dayjs from "dayjs";

export default function Dashboard({ stats, todayAppointments, calendarAppointments }) {
    // null = no filter, or one of: 'upcoming' | 'today' | 'missed'
    const [calendarFilter, setCalendarFilter] = useState(null);
    const [calendarOpen, setCalendarOpen] = useState(false);

    const mappedTodayAppointments = (todayAppointments ?? []).map((appointment) => ({
        id: appointment.id,
        next_appointment: appointment.next_appointment
            ? dayjs(appointment.next_appointment).format("MMM D, YYYY h:mm A")
            : "–",
        patient_name: appointment.patient?.patient_name || "–",
        service: appointment.services?.map(s => s.name).join(", ") || "–",
    }));

    function handleStatClick(filter) {
        // Clicking the same card again clears the filter
        setCalendarFilter((prev) => (prev === filter ? null : filter));
        setCalendarOpen(true);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="flex w-full bg-background text-foreground font-sans overflow-hidden">

                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="p-8 flex-1 flex flex-col gap-6 overflow-auto">

                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Patients"
                                value={stats?.total_patients ?? 0}
                                icon="users"
                                onClick={() => { window.location.assign('/patients'); }}
                            />

                            <StatsCard
                                title="Upcoming Appointments"
                                value={stats?.upcoming_appointments ?? 0}
                                icon="calendar"
                                onClick={() => { router.get(route('appointments.upcoming')); }}
                            />

                            <StatsCard
                                title="Today's Appointments"
                                value={stats?.todays_appointments ?? 0}
                                icon="clock"
                                active={calendarFilter === 'today'}
                                onClick={() => handleStatClick('today')}
                            />

                            <StatsCard
                                title="Missed Appointments"
                                value={stats?.missed_appointments ?? 0}
                                icon="alert-triangle"
                                onClick={() => { router.get(route('appointments.missed')); }}
                            />
                        </div>

                        {/* Content Row */}
                        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
                            <div className="col-span-3">
                                <ScheduleTable
                                    appointments={mappedTodayAppointments}
                                    calendarAppointments={calendarAppointments ?? []}
                                    stats={stats ?? {}}
                                    externalFilter={calendarFilter}
                                    externalOpen={calendarOpen}
                                    onCalendarClose={() => {
                                        setCalendarOpen(false);
                                        setCalendarFilter(null);
                                    }}
                                />
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}