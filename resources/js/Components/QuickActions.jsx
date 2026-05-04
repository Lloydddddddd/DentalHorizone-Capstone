import React from 'react';
import { UserPlus, CalendarPlus, DollarSign, FileText } from 'lucide-react';

const actions = [
    { label: 'Add Patient',  icon: UserPlus,     href: '/patients/create' },
    { label: 'Book Slot',    icon: CalendarPlus, href: '/appointments/create' },
    { label: 'Record Pay',   icon: DollarSign,   href: '/payments/create' },
    { label: 'Write Note',   icon: FileText,     href: '/notes/create' },
];

export default function QuickActions() {
    return (
        <div className="bg-surface border border-border rounded p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold font-headings">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
                {actions.map(({ label, icon: Icon, href }) => (
                    <a
                        key={label}
                        href={href}
                        className="flex flex-col items-center justify-center gap-2 p-4 border border-border rounded bg-background text-foreground hover:border-primary hover:bg-secondary transition-colors"
                    >
                        <Icon size={24} className="text-primary" />
                        <span className="text-sm font-medium">{label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
