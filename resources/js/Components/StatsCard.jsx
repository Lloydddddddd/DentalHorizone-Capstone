import React from 'react';
import { Users, DollarSign, UserPlus, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const iconMap = {
    users: Users,
    'dollar-sign': DollarSign,
    'user-plus': UserPlus,
    calendar: Calendar,
};

export default function StatsCard({ title, value, trend, trendUp, icon }) {
    const Icon = iconMap[icon] ?? Users;

    return (
        <div className="bg-surface p-6 rounded border border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">{title}</span>
                <div className="w-10 h-10 rounded-full bg-secondary text-secondary-fg flex items-center justify-center">
                    <Icon size={20} />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-bold font-headings text-foreground">{value}</span>
                <div className={`flex items-center text-sm font-medium ${trendUp ? 'text-success' : 'text-muted'}`}>
                    {trendUp ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                    {trend}
                </div>
            </div>
        </div>
    );
}
