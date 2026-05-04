import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    BarChart2,
    Settings,
    Smile,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Patients',    icon: Users,           href: '/patients' },
    { label: 'Appointments',icon: Calendar,        href: '/appointments' },
    { label: 'Payments',    icon: CreditCard,      href: '/payments' },
    { label: 'Reports',     icon: BarChart2,       href: '/reports' },
];

export default function Sidebar() {
    const { url } = usePage();

    return (
        <aside className="w-64 h-full bg-surface border-r border-border flex flex-col shrink-0">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <Smile size={20} />
                </div>
                <span className="font-bold text-lg text-foreground font-headings">
                    Dental Horizon
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
                {navItems.map(({ label, icon: Icon, href }) => {
                    const active = url.startsWith(href);
                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                                active
                                    ? 'bg-primary text-white'
                                    : 'text-muted hover:bg-secondary hover:text-foreground'
                            }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Settings */}
            <div className="p-4">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-muted hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Settings size={18} />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
