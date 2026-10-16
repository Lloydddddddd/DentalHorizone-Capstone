import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

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
        { 
            label: 'Dashboard', 
            href: '/dashboard', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1v-5m10-10l2 2m-2-2v10a1 1 0 01-1 1v-5m-6 0a1 1 0 001-1v5" />
                </svg>
            )
        },
        { 
            label: 'Patients', 
            href: '/patients', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 01-5.356-1.857M17 20H7m5-2v2m-5-2v2m-2-2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" />
                </svg>
            )
        },
        { 
            label: 'Dental Services', 
            href: '/services', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 4.5C8.5 4.5 5 7 5 11C5 14 8 17 12 19.5C16 17 19 14 19 11C19 7 15.5 4.5 12 4.5Z" />
                    <path d="M12 7C10.343 7 9 8.343 9 10" />
                    <circle cx="12" cy="13" r="1" fill="currentColor"/>
                </svg>
            )
        },
        { 
            label: 'Appointments', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2" />
                </svg>
            ),
            children: [
                { label: 'All Appointments', href: '/appointments' },
                { label: 'Upcoming Appointments', href: '/Appointments/Upcoming' },
                { label: 'Missed Appointments', href: '/Appointments/Missed' },
            ],
        },
    ];

    return (
        <aside
            className={`shrink-0 border-r border-gray-200 bg-white transition-all duration-300 flex flex-col h-screen ${
                sidebarOpen ? 'w-64' : 'w-20'
            }`}
        >
            {/* Logo + Toggle - Improved visibility */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0">
                            DH
                        </div>
                        {sidebarOpen && (
                            <span className="font-semibold text-lg text-gray-800 truncate">
                                Dental Horizone
                            </span>
                        )}
                    </div>

                    {/* Toggle Button - Always visible and prominent */}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen((v) => !v)}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all flex-shrink-0 text-2xl leading-none"
                        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 flex flex-col gap-1.5 overflow-y-auto">
                {sidebarItems.map((item) => {
                    if (item.children) {
                        const isActiveParent = activeUrl.startsWith('/appointments');
                        const isExpanded = appointmentsOpen && sidebarOpen;

                        return (
                            <div key={item.label} className="flex flex-col">
                                <button
                                    type="button"
                                    onClick={() => setAppointmentsOpen((prev) => !prev)}
                                    className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all relative ${
                                        isActiveParent
                                            ? 'bg-blue-900 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    } ${sidebarOpen ? '' : 'justify-center'}`}
                                    title={sidebarOpen ? '' : item.label}
                                >
                                    <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
                                        {item.icon}
                                    </span>
                                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                                    
                                    {sidebarOpen && (
                                        <span className="ml-auto text-xs transition-transform duration-200">
                                            {appointmentsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        </span>
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="ml-9 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-5">
                                        {item.children.map((child) => {
                                            const active = activeUrl === child.href.toLowerCase();
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={`flex items-center px-4 py-2.5 rounded-2xl text-sm transition-all ${
                                                        active
                                                            ? 'bg-blue-900/10 text-primary font-semibold'
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

                    const active = activeUrl.startsWith(item.href.toLowerCase());
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all relative ${
                                active
                                    ? 'bg-blue-900 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            } ${sidebarOpen ? '' : 'justify-center'}`}
                            title={sidebarOpen ? '' : item.label}
                        >
                            <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
                                {item.icon}
                            </span>
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}