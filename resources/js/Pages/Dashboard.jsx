import React, { useMemo, useState } from 'react';

import { Head, Link, usePage } from '@inertiajs/react';

import StatsCard from '../components/StatsCard';
import ScheduleTable from '../components/ScheduleTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ stats, todayAppointments, calendarAppointments }) {
    const [appointmentsOpen, setAppointmentsOpen] = useState(false);

    // null = no filter, or one of: 'upcoming' | 'today' | 'missed'
    const [calendarFilter, setCalendarFilter] = useState(null);
    const [calendarOpen, setCalendarOpen] = useState(false);

    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    function handleStatClick(filter) {
        // Clicking the same card again clears the filter
        setCalendarFilter((prev) => (prev === filter ? null : filter));
        setCalendarOpen(true);
    }

    const sidebarItems = useMemo(
        () => [
            { label: 'Patients', href: '/patients' },
            {
                label: 'Appointments',
                children: [
                    { label: 'All Appointments', href: '/appointments' },
                    { label: 'Upcoming Appointments', href: '/Appointments/Upcoming' },
                    { label: 'Missed Appointments', href: '/Appointments/Missed' },
                ],
            },
            { label: 'Reports', href: '/reports' },
        ],
        [],
    );

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

                <aside
                    className={`shrink-0 border-r border-border bg-surface transition-all duration-300 flex flex-col h-full ${
                        sidebarOpen ? 'w-64' : 'w-16'
                    }`}
                >
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                                DH
                            </div>
                            {sidebarOpen && (
                                <span className="font-bold text-lg text-foreground font-headings truncate">
                                    Dental Horizon
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setSidebarOpen((v) => !v)}
                            className="text-foreground/70 hover:text-foreground p-2 rounded transition-colors"
                            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        >
                            <span className="text-sm">{sidebarOpen ? '❮' : '❯'}</span>
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
                        {sidebarItems.map((item) => {
                            if (item.children) {
                                return (
                                    <div key={item.label} className="flex flex-col">
                                        {/* Parent button */}
                                        <button
                                            type="button"
                                            onClick={() => setAppointmentsOpen((prev) => !prev)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                                                url.startsWith('/appointments')
                                                    ? 'bg-primary text-white'
                                                    : 'text-muted hover:bg-secondary hover:text-foreground'
                                            } ${sidebarOpen ? '' : 'justify-center'}`}
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-current opacity-70" />
                                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                                            {sidebarOpen && <span className="ml-auto">{appointmentsOpen ? '▾' : '▸'}</span>}
                                        </button>

                                        {/* Children links (only show if open) */}
                                        {appointmentsOpen && (
                                            <div className="ml-6 flex flex-col gap-1">
                                                {item.children.map((child) => {
                                                    const active = url && (url === child.href || url.startsWith(child.href));
                                                    return (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                                                                active
                                                                    ? 'bg-primary text-white'
                                                                    : 'text-muted hover:bg-secondary hover:text-foreground'
                                                            }`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Normal single link
                            const active = url && (url === item.href || url.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-primary text-white'
                                            : 'text-muted hover:bg-secondary hover:text-foreground'
                                    } ${sidebarOpen ? '' : 'justify-center'}`}
                                >
                                    <span className="w-2.5 h-2.5 rounded-full bg-current opacity-70" />
                                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                </aside>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="p-8 flex-1 flex flex-col gap-6 overflow-auto">

                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Patients"
                                value={stats?.total_patients ?? 0}
                                trend={stats?.total_patients_trend ?? '+0%'}
                                trendUp={stats?.total_patients_trend_up ?? true}
                                icon="users"
                                onClick={() => { window.location.assign('/patients'); }}
                            />

                            <StatsCard
                                title="Upcoming Appointments"
                                value={stats?.upcoming_appointments ?? 0}
                                trend={stats?.upcoming_appointments_trend ?? '+0%'}
                                trendUp={stats?.upcoming_appointments_trend_up ?? true}
                                icon="calendar"
                                active={calendarFilter === 'upcoming'}
                                onClick={() => handleStatClick('upcoming')}
                            />

                            <StatsCard
                                title="Today's Appointments"
                                value={stats?.todays_appointments ?? 0}
                                trend={stats?.todays_appointments_trend ?? '+0%'}
                                trendUp={stats?.todays_appointments_trend_up ?? true}
                                icon="clock"
                                active={calendarFilter === 'today'}
                                onClick={() => handleStatClick('today')}
                            />

                            <StatsCard
                                title="Missed Appointments"
                                value={stats?.missed_appointments ?? 0}
                                trend={stats?.missed_appointments_trend ?? '-0%'}
                                trendUp={stats?.missed_appointments_trend_up ?? false}
                                icon="alert-triangle"
                                active={calendarFilter === 'missed'}
                                onClick={() => handleStatClick('missed')}
                            />
                        </div>

                        {/* Content Row */}
                        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
                            <div className="col-span-3">
                                <ScheduleTable
                                    appointments={todayAppointments ?? []}
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