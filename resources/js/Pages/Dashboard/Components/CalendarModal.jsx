import React, { useState, useEffect } from 'react';
import { STATUS_COLORS, FILTER_LABELS } from './calendarHelpers';
import dayjs from 'dayjs';

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

const pad2 = (n) => String(n).padStart(2, '0');

/** Local (not UTC) YYYY-MM-DD key, so early-morning bookings stay on their day. */
function localDateKey(value) {
    const date = new Date(value);
    if (isNaN(date)) return null;

    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/**
 * Statuses we consider "active" for the calendar view.
 * `completed` and `cancelled` are intentionally excluded so the calendar
 * reflects what's still scheduled, not what's already done.
 */
const ACTIVE_STATUSES = ['pending', 'confirmed', 'scheduled', 'rescheduled'];

/**
 * Resolve an appointment's canonical status.
 * Explicit status wins; otherwise fall back to a date comparison.
 */
function getApptStatus(appt) {
    const raw = appt.next_appointment_raw || appt.next_appointment;
    if (!raw) return null;

    const status = String(appt.visit_status || '').toLowerCase();

    // Explicit outcomes win
    if (['completed', 'cancelled', 'rescheduled'].includes(status)) {
        return status;
    }

    const now = new Date();
    const at = new Date(raw);

    if (at.toDateString() === now.toDateString()) return 'today';
    if (at > now) return 'upcoming';
    return 'missed';
}

function dayBadgeColor(dayAppts) {
    const statuses = dayAppts.map((a) => getApptStatus(a));
    if (statuses.includes('missed'))      return 'missed';
    if (statuses.includes('rescheduled')) return 'rescheduled';
    if (statuses.includes('confirmed'))   return 'confirmed';
    if (statuses.includes('upcoming'))    return 'upcoming';
    if (statuses.includes('today'))       return 'today';
    return null;
}

export default function CalendarModal({ appointments, onClose, initialFilter = null }) {
    const today    = new Date();
    const todayStr = localDateKey(today);

    const [viewYear,   setViewYear]   = useState(today.getFullYear());
    const [viewMonth,  setViewMonth]  = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(null);
    const [activeFilter, setActiveFilter] = useState(initialFilter); // null | 'missed' | 'today' | 'upcoming'

    // Sync if parent changes filter
    useEffect(() => {
        setActiveFilter(initialFilter);
        setSelectedDay(null);
    }, [initialFilter]);

    // When a filter activates, jump to today if it's the "today" filter
    useEffect(() => {
        if (!activeFilter) return;

        if (activeFilter === 'today') {
            setViewYear(today.getFullYear());
            setViewMonth(today.getMonth());
            setSelectedDay(today.getDate());
            return;
        }

        setSelectedDay(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilter]);

    // ── Filter appointments ────────────────────────────────────────────
    // Always exclude completed/cancelled so the calendar only shows live work.
    const activeAppointments = appointments.filter((a) =>
        ACTIVE_STATUSES.includes(String(a.visit_status || '').toLowerCase())
    );

    const visibleAppointments = activeFilter
        ? activeAppointments.filter((a) => {
              const raw = a.next_appointment_raw || a.next_appointment;
              if (!raw) return false;
              const apptDate = new Date(raw);

              if (activeFilter === 'today') {
                  return apptDate.toDateString() === today.toDateString();
              }
              if (activeFilter === 'missed') {
                  return apptDate < today;
              }
              if (activeFilter === 'upcoming') {
                  return apptDate > today;
              }
              return false;
          })
        : activeAppointments;

    // ── Group by date ─────────────────────────────────────────────────
    const apptsByDate = {};
    visibleAppointments.forEach((appt) => {
        const raw = appt.next_appointment_raw || appt.next_appointment;
        const key = raw ? localDateKey(raw) : null;
        if (key) {
            if (!apptsByDate[key]) apptsByDate[key] = [];
            apptsByDate[key].push(appt);
        }
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

    const selectedAppts =
        activeFilter === 'today'
            ? apptsByDate[todayStr] ?? []
            : selectedDateStr
                ? apptsByDate[selectedDateStr] ?? []
                : [];

    // ── Filter pill counts ────────────────────────────────────────────
    const counts = {
        missed: activeAppointments.filter((a) => {
            const raw = a.next_appointment_raw || a.next_appointment;
            return raw && new Date(raw) < today;
        }).length,

        today: activeAppointments.filter((a) => {
            const raw = a.next_appointment_raw || a.next_appointment;
            return raw && new Date(raw).toDateString() === today.toDateString();
        }).length,

        upcoming: activeAppointments.filter((a) => {
            const raw = a.next_appointment_raw || a.next_appointment;
            return raw && new Date(raw) > today;
        }).length,
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

                {/* Modal Header */}
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

                {/* Filter Pills */}
                <div className="flex items-center gap-2 px-6 pt-4">
                    <button
                        onClick={() => { setActiveFilter(null); setSelectedDay(null); }}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors
                            ${activeFilter === null
                                ? 'bg-gray-800 text-white border-gray-800'
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}
                    >
                        All ({activeAppointments.length})
                    </button>

                    {(['missed', 'today', 'upcoming']).map((f) => (
                        <button
                            key={f}
                            onClick={() => { setActiveFilter(prev => (prev === f ? null : f)); setSelectedDay(null); }}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-colors
                                ${activeFilter === f
                                    ? `${STATUS_COLORS[f]?.bg ?? 'bg-gray-800'} ${STATUS_COLORS[f]?.text ?? 'text-white'} border-transparent`
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${activeFilter === f ? 'bg-white' : (STATUS_COLORS[f]?.dot ?? 'bg-gray-400')}`} />
                            {FILTER_LABELS[f]?.label ?? f} ({counts[f]})
                        </button>
                    ))}
                </div>

                <div className="p-6 flex flex-col gap-4">
                    {/* Month Navigation */}
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

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
                    </div>

                    {/* Day Cells */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} />;

                            const dateStr  = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayAppts = apptsByDate[dateStr] ?? [];
                            const badge    = dayBadgeColor(dayAppts);
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
                                        <span className={`mt-0.5 w-2 h-2 rounded-full ${STATUS_COLORS[badge]?.dot ?? 'bg-gray-400'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected Day Detail */}
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
                                        const status = getApptStatus(appt);
                                        const colors = STATUS_COLORS[status] ?? STATUS_COLORS.pending;
                                        const rawDate = appt.next_appointment_raw || appt.next_appointment;
                                        const timeLabel = rawDate
                                            ? dayjs(rawDate).format('h:mm A')
                                            : '—';

                                        return (
                                            <li
                                                key={appt.id ?? i}
                                                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${colors.light}`}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold">{appt.patient_name}</span>
                                                    <span className="text-xs opacity-70" title={appt.service}>
                                                        {appt.service || 'No service'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                                                    <span className="font-medium text-xs">{timeLabel}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors.bg} ${colors.text}`}>
                                                        {String(status || '').replace(/^\w/, (c) => c.toUpperCase())}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Empty state */}
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