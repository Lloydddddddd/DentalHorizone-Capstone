import React from 'react';

const appointments = [
    {
        time: '09:00 AM',
        patient: 'Emma Thompson',
        avatar: 'https://storage.googleapis.com/banani-avatars/avatar/female/25-35/European/2',
        treatment: 'Root Canal',
        doctor: 'Dr. Smith',
        status: 'In Progress',
        statusColor: 'success',
    },
    {
        time: '10:30 AM',
        patient: 'Michael Chen',
        avatar: 'https://storage.googleapis.com/banani-avatars/avatar/male/25-35/European/3',
        treatment: 'Checkup',
        doctor: 'Dr. Davis',
        status: 'Waiting',
        statusColor: 'warning',
    },
    {
        time: '11:15 AM',
        patient: 'Sarah Wilson',
        avatar: 'https://storage.googleapis.com/banani-avatars/avatar/female/25-35/European/4',
        treatment: 'Cleaning',
        doctor: 'Dr. Smith',
        status: 'Confirmed',
        statusColor: 'success',
    },
    {
        time: '01:00 PM',
        patient: 'James Rodriguez',
        avatar: 'https://storage.googleapis.com/banani-avatars/avatar/male/25-35/European/5',
        treatment: 'Consultation',
        doctor: 'Dr. Davis',
        status: 'Confirmed',
        statusColor: 'success',
    },
];

const statusStyles = {
    success: 'bg-success/10 text-success',
    warning: 'bg-amber-50 text-amber-600',
    danger:  'bg-red-50 text-red-500',
};

export default function ScheduleTable() {
    return (
        <div className="bg-surface border border-border rounded flex flex-col h-full">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-bold font-headings">Today's Schedule</h2>
                <button className="text-sm font-medium text-primary bg-secondary px-3 py-1.5 rounded">
                    View Calendar
                </button>
            </div>
            <div className="overflow-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-border text-muted">
                            <th className="px-6 py-3 font-medium">Time</th>
                            <th className="px-6 py-3 font-medium">Patient</th>
                            <th className="px-6 py-3 font-medium">Treatment</th>
                            <th className="px-6 py-3 font-medium">Doctor</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appt, idx) => (
                            <tr key={idx} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                                <td className="px-6 py-4 font-medium">{appt.time}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={appt.avatar}
                                            alt={appt.patient}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="font-medium text-foreground">{appt.patient}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted">{appt.treatment}</td>
                                <td className="px-6 py-4 text-muted">{appt.doctor}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[appt.statusColor]}`}>
                                        {appt.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
