import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar() {
    const { url } = usePage();
    const activeUrl = url.toLowerCase();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [appointmentsOpen, setAppointmentsOpen] = useState(false);

    useEffect(() => {
        if (activeUrl.startsWith('/appointments')) {
            setAppointmentsOpen(true);
        }
    }, [activeUrl]);

    const sidebarItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Patients', href: '/patients' },
        { label: 'Dental Services', href: '/services' },
        { label: 'Archived Patients', href: '/archived-patients' },
        {
            label: 'Appointments',
            children: [
                { label: 'All Appointments', href: '/appointments' },
                { label: 'Upcoming Appointments', href: '/Appointments/Upcoming' },
                { label: 'Missed Appointments', href: '/Appointments/Missed' },
            ],
        },
        { label: 'Reports', href: '/reports' },
    ];

    return (
        <aside
            className={`shrink-0 border-r border-gray-200 bg-white transition-all duration-300 flex flex-col h-screen ${
                sidebarOpen ? 'w-64' : 'w-20'
            }`}
        >
            {/* Logo + Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                        DH
                    </div>
                    {sidebarOpen && (
                        <span className="font-bold text-lg text-gray-800 truncate">
                            Dental Horizone
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setSidebarOpen((v) => !v)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded transition-colors"
                >
                    <span className="text-lg">{sidebarOpen ? '❮' : '❯'}</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    if (item.children) {
                        return (
                            <div key={item.label} className="flex flex-col">
                                {/* Parent button */}
                                <button
                                    type="button"
                                    onClick={() => setAppointmentsOpen((prev) => !prev)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeUrl.startsWith('/appointments')
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    } ${sidebarOpen ? '' : 'justify-center'}`}
                                >
                                    <span className="w-2.5 h-2.5 rounded-full bg-current opacity-70" />
                                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                                    {sidebarOpen && (
                                        <span className="ml-auto text-xs">
                                            {appointmentsOpen ? '▾' : '▸'}
                                        </span>
                                    )}
                                </button>

                                {/* Children links */}
                                {appointmentsOpen && sidebarOpen && (
                                    <div className="ml-6 flex flex-col gap-1">
                                        {item.children.map((child) => {
                                            const active = activeUrl === child.href.toLowerCase();
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                                        active
                                                            ? 'bg-primary text-white'
                                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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

                    // Single links
                    const active = activeUrl.startsWith(item.href.toLowerCase());
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                active
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            } ${sidebarOpen ? '' : 'justify-center'}`}
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-current opacity-70" />
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}