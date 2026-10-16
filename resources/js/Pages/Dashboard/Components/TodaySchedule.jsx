import { Link } from '@inertiajs/react';
import { CalendarDays, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import StatusPill from '@/Components/StatusPill';

// Decorative per-row accent (ring + dot), cycling through the palette.
const DOTS = [
    ['bg-[#eaf0fb]', 'bg-[#4f76b9]'],
    ['bg-[#fdf1e1]', 'bg-[#e0974a]'],
    ['bg-[#f0ebf9]', 'bg-[#7a65af]'],
    ['bg-[#e6f6f2]', 'bg-[#3a9a85]'],
];

export default function TodaySchedule({ dateLabel, appointments = [] }) {
    return (
        <section className="flex h-full flex-col rounded-2xl border border-clinic-line bg-white shadow-[0_1px_2px_rgba(15,31,51,0.04)]">
            <header className="flex items-start justify-between border-b border-clinic-line px-7 py-6">
                <div>
                    <h2 className="text-[18px] font-semibold text-clinic-ink">Today&rsquo;s schedule</h2>
                    <p className="mt-1.5 text-[13px] text-slate-400">{dateLabel}</p>
                </div>
                <Link
                    href="/appointments"
                    className="flex items-center gap-1 pt-1 text-[15px] font-semibold text-clinic-blue hover:underline"
                >
                    View all <ChevronRight className="h-5 w-5" />
                </Link>
            </header>

            {appointments.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-20 text-slate-400">
                    <CalendarDays className="h-9 w-9" />
                    <p className="text-[16px] font-medium text-slate-500">
                        No appointments scheduled for today
                    </p>
                    <p className="text-[13px]">New bookings will show up here.</p>
                </div>
            ) : (
                <ul className="max-h-[38rem] divide-y divide-[#edf0f4] overflow-y-auto">
                    {appointments.map((appt, index) => {
                        const [ring, dot] = DOTS[index % DOTS.length];
                        const at = appt.next_appointment_raw
                            ? dayjs(appt.next_appointment_raw)
                            : null;
                        const time = at ? at.format('h:mm A') : '—';
                        const period = at
                            ? at.hour() < 12
                                ? 'Morning'
                                : at.hour() < 17
                                  ? 'Afternoon'
                                  : 'Evening'
                            : '';

                        return (
                            <li key={appt.id}>
                                <Link
                                    href={`/appointments?highlight=${appt.id}`}
                                    className="flex items-center gap-5 px-7 py-5 transition-colors hover:bg-slate-50"
                                >
                                    <div className="w-28 shrink-0">
                                        <p className="text-[15px] font-semibold text-clinic-ink">
                                            {time}
                                        </p>
                                        <p className="text-[13px] text-slate-400">{period}</p>
                                    </div>

                                    <span
                                        className={`hidden h-6 w-6 shrink-0 items-center justify-center rounded-full sm:flex ${ring}`}
                                    >
                                        <span className={`h-2 w-2 rounded-full ${dot}`} />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[16px] font-semibold text-clinic-ink">
                                            {appt.patient_name}
                                        </p>
                                        <p className="mt-0.5 truncate text-[13px] text-slate-400">
                                            {appt.service}
                                        </p>
                                    </div>

                                    <StatusPill status={appt.visit_status} />
                                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}