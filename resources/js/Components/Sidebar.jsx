import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar() {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [appointmentsOpen, setAppointmentsOpen] = useState(false);

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
            className={`shrink-0 border-r border-border bg-surface transition-all duration-300 flex flex-col h-screen ${
                sidebarOpen ? 'w-64' : 'w-16'
            }`}
        >
            {/* Logo + Toggle */}
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
                >
                    <span className="text-sm">{sidebarOpen ? '❮' : '❯'}</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
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

                                {/* Children links */}
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

                    // Single links
                    const active = url && url.startsWith(item.href);
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
    );
}