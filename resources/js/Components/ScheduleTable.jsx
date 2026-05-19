import React, { useState, useEffect } from 'react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function formatMonthYear(year, month) {
    return new Date(year, month, 1).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    });
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Resolve an appointment's canonical status.
 * Priority: explicit visit_status field → date comparison fallback.
 */
function getApptStatus(appt, todayStr) {
    const vs = (appt.visit_status ?? '').toLowerCase();

    if (vs === 'missed')   return 'missed';
    if (vs === 'upcoming') return 'upcoming';
    if (vs === 'today')    return 'today';

    // Fallback: use the date field
    if (appt.date) {
        if (appt.date < todayStr) return 'missed';
        if (appt.date === todayStr) return 'today';
        if (appt.date > todayStr)  return 'upcoming';
    }

    return 'today';
}

function dayBadgeColor(dayAppts, todayStr) {
    const statuses = dayAppts.map((a) => getApptStatus(a, todayStr));
    if (statuses.includes('missed'))   return 'missed';
    if (statuses.includes('today'))    return 'today';
    if (statuses.includes('upcoming')) return 'upcoming';
    return null;
}

const STATUS_COLORS = {
    missed:   {
        bg: 'bg-red-500',
        text: 'text-white',
        light: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        btn: 'bg-red-500 hover:bg-red-600',
    },
    today:    {
        bg: 'bg-orange-500',
        text: 'text-white',
        light: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
        btn: 'bg-orange-500 hover:bg-orange-600',
    },
    upcoming: {
        bg: 'bg-green-500',
        text: 'text-white',
        light: 'bg-green-50 text-green-700 border-green-200',
        dot: 'bg-green-500',
        btn: 'bg-green-500 hover:bg-green-600',
    },
};

// Filter label display
const FILTER_LABELS = {
    missed:   { label: 'Missed',   color: 'bg-red-100 text-red-700' },
    today:    { label: 'Today',    color: 'bg-orange-100 text-orange-700' },
    upcoming: { label: 'Upcoming', color: 'bg-green-100 text-green-700' },
};

// ─── Calendar Modal ──────────────────────────────────────────────────────────

function CalendarModal({ appointments, onClose, initialFilter = null }) {
    const today    = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const [viewYear,   setViewYear]   = useState(today.getFullYear());
    const [viewMonth,  setViewMonth]  = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(null);
    const [activeFilter, setActiveFilter] = useState(initialFilter); // null | 'missed' | 'today' | 'upcoming'

    // Sync if parent changes filter (e.g. clicking a different stat card while modal is open)
    useEffect(() => {
        setActiveFilter(initialFilter);
        setSelectedDay(null);
    }, [initialFilter]);

    // When a filter activates, jump to the first month that has matching appointments
    useEffect(() => {
        if (!activeFilter) return;
        const filtered = appointments.filter(a => getApptStatus(a, todayStr) === activeFilter);
        if (filtered.length === 0) return;
        // Sort ascending and pick first
        const sorted = [...filtered].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
        const firstDate = sorted[0].date;
        if (firstDate) {
            const d = new Date(firstDate);
            setViewYear(d.getFullYear());
            setViewMonth(d.getMonth());
        }
    }, [activeFilter]);

    // Apply filter to the full appointment list
    const visibleAppointments = activeFilter
        ? appointments.filter(a => getApptStatus(a, todayStr) === activeFilter)
        : appointments;

    // Group by date
    const apptsByDate = {};
    visibleAppointments.forEach((appt) => {
        const key = appt.date ?? todayStr;
        if (!apptsByDate[key]) apptsByDate[key] = [];
        apptsByDate[key].push(appt);
    });

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);

    function prevMonth() {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
        setSelectedDay(null);
    }

    function nextMonth() {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
        setSelectedDay(null);
    }

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const selectedDateStr = selectedDay
        ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
        : null;
    const selectedAppts = selectedDateStr ? (apptsByDate[selectedDateStr] ?? []) : [];

    // Counts for filter pills
    const counts = {
        missed:   appointments.filter(a => getApptStatus(a, todayStr) === 'missed').length,
        today:    appointments.filter(a => getApptStatus(a, todayStr) === 'today').length,
        upcoming: appointments.filter(a => getApptStatus(a, todayStr) === 'upcoming').length,
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

                {/* ── Modal Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Appointment Calendar</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Filter Pills ── */}
                <div className="flex items-center gap-2 px-6 pt-4">
                    <button
                        onClick={() => { setActiveFilter(null); setSelectedDay(null); }}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors
                            ${activeFilter === null
                                ? 'bg-gray-800 text-white border-gray-800'
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}
                    >
                        All ({appointments.length})
                    </button>

                    {(['missed', 'today', 'upcoming']).map((f) => (
                        <button
                            key={f}
                            onClick={() => { setActiveFilter(prev => prev === f ? null : f); setSelectedDay(null); }}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-colors
                                ${activeFilter === f
                                    ? `${STATUS_COLORS[f].bg} ${STATUS_COLORS[f].text} border-transparent`
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${activeFilter === f ? 'bg-white' : STATUS_COLORS[f].dot}`} />
                            {FILTER_LABELS[f].label} ({counts[f]})
                        </button>
                    ))}
                </div>

                <div className="p-6 flex flex-col gap-4">
                    {/* ── Month Navigation ── */}
                    <div className="flex items-center justify-between">
                        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 text-lg">
                            ‹
                        </button>
                        <span className="font-semibold text-gray-700">
                            {formatMonthYear(viewYear, viewMonth)}
                        </span>
                        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 text-lg">
                            ›
                        </button>
                    </div>

                    {/* ── Weekday Headers ── */}
                    <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
                    </div>

                    {/* ── Day Cells ── */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} />;

                            const dateStr  = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayAppts = apptsByDate[dateStr] ?? [];
                            const badge    = dayBadgeColor(dayAppts, todayStr);
                            const isToday  = dateStr === todayStr;
                            const isSel    = day === selectedDay;

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                                    className={`
                                        relative flex flex-col items-center justify-center rounded-xl py-2 text-sm font-medium transition-all
                                        ${isSel  ? 'ring-2 ring-offset-1 ring-indigo-400 scale-105 bg-indigo-50' : 'hover:bg-gray-50'}
                                        ${isToday && !isSel ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}
                                        ${dayAppts.length > 0 && !isSel ? 'font-bold' : ''}
                                    `}
                                >
                                    {day}
                                    {badge && (
                                        <span className={`mt-0.5 w-2 h-2 rounded-full ${STATUS_COLORS[badge].dot}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Selected Day Detail ── */}
                    {selectedDay && (
                        <div className="border border-gray-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('default', {
                                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                                })}
                            </p>
                            {selectedAppts.length === 0 ? (
                                <p className="text-sm text-gray-400">No appointments on this day.</p>
                            ) : (
                                <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                    {selectedAppts.map((appt, i) => {
                                        const status = getApptStatus(appt, todayStr);
                                        const colors = STATUS_COLORS[status];
                                        return (
                                            <li
                                                key={appt.id ?? i}
                                                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${colors.light}`}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold">{appt.patient_name}</span>
                                                    <span className="text-xs opacity-70">{appt.complaint}</span>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {appt.occupation ? <span>{appt.occupation}</span> : null}
                                                        {appt.email ? <span className="ml-2">{appt.email}</span> : null}
                                                    </div>

                                                </div>
                                                <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                                                    <span className="font-medium text-xs">{appt.time}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors.bg} ${colors.text}`}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* ── Empty state when filter yields nothing ── */}
                    {activeFilter && visibleAppointments.length === 0 && (
                        <div className="text-center py-6 text-sm text-gray-400">
                            No {activeFilter} appointments found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

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
                    <h2 className="text-lg font-bold font-headings">Today's Action</h2>
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
                                <th className="px-6 py-3 font-medium">Time</th>
                                <th className="px-6 py-3 font-medium">Patient Name</th>
                                <th className="px-6 py-3 font-medium">Complaint</th>
                                <th className="px-6 py-3 font-medium">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-muted">
                                        No appointments for today.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((appt, idx) => (
                                    <tr
                                        key={appt.id ?? idx}
                                        className="border-b border-border last:border-0 hover:bg-background transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium">{appt.time}</td>
                                        <td className="px-6 py-4">{appt.patient_name}</td>
                                        <td className="px-6 py-4 text-muted">{appt.complaint}</td>
                                        <td className="px-6 py-4 font-medium">{appt.price}</td>
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
