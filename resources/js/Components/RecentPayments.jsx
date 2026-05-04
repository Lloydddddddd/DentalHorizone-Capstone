import React from 'react';
import { ArrowDownLeft } from 'lucide-react';

const payments = [
    { label: 'Root Canal',    time: 'Today, 9:05 AM',  amount: '+$850.00' },
    { label: 'Consultation',  time: 'Today, 10:45 AM', amount: '+$150.00' },
    { label: 'Cleaning',      time: 'Today, 8:30 AM',  amount: '+$120.00' },
];

export default function RecentPayments() {
    return (
        <div className="bg-surface border border-border rounded p-6 flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-headings">Recent Payments</h2>
                <a href="/payments" className="text-sm text-primary font-medium hover:underline">
                    View All
                </a>
            </div>
            <div className="flex flex-col gap-4">
                {payments.map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center">
                                <ArrowDownLeft size={18} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-foreground">{payment.label}</div>
                                <div className="text-xs text-muted">{payment.time}</div>
                            </div>
                        </div>
                        <div className="text-sm font-bold text-foreground">{payment.amount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
