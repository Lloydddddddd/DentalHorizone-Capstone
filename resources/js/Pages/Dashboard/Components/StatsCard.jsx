import React from 'react';
import {
    Users,
    DollarSign,
    UserPlus,
    Calendar,
    Clock,
    AlertTriangle,
} from 'lucide-react';

const iconMap = {
    users:            Users,
    'dollar-sign':    DollarSign,
    'user-plus':      UserPlus,
    calendar:         Calendar,
    clock:            Clock,
    'alert-triangle': AlertTriangle,
};

export default function StatsCard({ title, value, icon, onClick, active = false }) {
    const Icon = iconMap[icon] ?? Users;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full text-left bg-surface p-6 rounded border flex flex-col gap-4
                transition-all duration-150
                ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : 'cursor-default'}
                ${active
                    ? 'border-indigo-500 ring-2 ring-indigo-300 shadow-md'
                    : 'border-border'}
            `}
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${active ? 'bg-indigo-600 text-white' : 'bg-secondary text-secondary-fg'}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-bold font-headings text-foreground">{value}</span>
            </div>
        </button>
    );
}