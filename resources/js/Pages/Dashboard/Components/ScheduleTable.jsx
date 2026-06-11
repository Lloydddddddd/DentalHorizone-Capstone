import React, { useState } from 'react';
import CalendarModal from './CalendarModal';
import { STATUS_COLORS } from './calendarHelpers';
import dayjs from 'dayjs';

export default function ScheduleTable({
    appointments = [],
    calendarAppointments = [],
    stats = {},
    externalFilter = null,
    externalOpen = false,
    onCalendarClose = null,
}) {
    const [internalOpen, setInternalOpen] = useState(false);

    // Merge external open (from stat card clicks) with internal (View Calendar button)
    const isOpen = externalOpen || internalOpen;

    function handleClose() {
        setInternalOpen(false);
        if (onCalendarClose) onCalendarClose();
    }

    // Button color: driven by stats hierarchy
    const buttonColor = (() => {
        if ((stats.missed_appointments   ?? 0) > 0) return STATUS_COLORS.missed.btn;
        if ((stats.todays_appointments   ?? 0) > 0) return STATUS_COLORS.today.btn;
        if ((stats.upcoming_appointments ?? 0) > 0) return STATUS_COLORS.upcoming.btn;
        return 'bg-green-500 hover:bg-green-600';
    })();

    return (
        <>
            <div className="bg-surface border border-border rounded flex flex-col h-full">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-bold font-headings">Today's Appointments</h2>
                    <button
                        className={`text-sm font-medium px-3 py-1.5 rounded transition-colors text-white ${buttonColor}`}
                        type="button"
                        onClick={() => setInternalOpen(true)}
                    >
                        View Calendar
                    </button>
                </div>

                <div className="overflow-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border text-muted">
                                <th className="px-6 py-3 font-medium">Next Appointment</th>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Service</th>
                                <th className="px-6 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" 
                                                className="h-10 w-10 mb-2 text-gray-400" 
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-lg font-medium">No appointments scheduled for today</p>
                                            <p className="text-sm">Check upcoming or missed appointments from the dashboard.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((appt, idx) => (
                                    <tr
                                        key={appt.id ?? idx}
                                        className="border-b border-border last:border-0 odd:bg-gray-50 even:bg-white hover:bg-indigo-50 transition-colors"
                                    >
                                        {/* Next Appointment */}
                                        <td className="px-6 py-4 font-medium">
                                            {appt.next_appointment 
                                                ? dayjs(appt.next_appointment).format('MMM D, YYYY h:mm A') 
                                                : '—'}
                                        </td>

                                        {/* Patient Name */}
                                        <td className="px-6 py-4 font-semibold">{appt.patient_name}</td>

                                        {/* Service */}
                                        <td className="px-6 py-4 text-gray-500">{appt.service ?? '—'}</td>

                                        {/* Action Button */}
                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    window.location.assign(`/appointments?highlight=${appt.id}`);
                                                }}
                                                className="px-3 py-1.5 text-sm font-medium rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpen && (
                <CalendarModal
                    appointments={calendarAppointments}
                    onClose={handleClose}
                    initialFilter={externalFilter}
                />
            )}
        </>
    );
}
