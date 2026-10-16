import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { CalendarDays, Sparkles, Users, Wallet } from 'lucide-react';
import ClinicLayout from '@/Layouts/ClinicLayout';
import OverviewStatCard from '@/Pages/Dashboard/Components/OverviewStatCard';
import TodaySchedule from '@/Pages/Dashboard/Components/TodaySchedule';
import ClinicOverview from '@/Pages/Dashboard/Components/ClinicOverview';
import CalendarModal from '@/Pages/Dashboard/Components/CalendarModal';

function formatPeso(amount) {
    const value = Number(amount) || 0;
    const compact = (n, suffix) => `₱${n.toFixed(1).replace(/\.0$/, '')}${suffix}`;

    if (value >= 1_000_000) return compact(value / 1_000_000, 'M');
    if (value >= 1_000) return compact(value / 1_000, 'K');
    return `₱${Math.round(value).toLocaleString('en-PH')}`;
}

function revenueCaption(change, previousMonth) {
    if (change === null || change === undefined) return 'Collected this month';
    return `${change > 0 ? '+' : ''}${change}% from ${previousMonth}`;
}

export default function Dashboard({ today, stats, activity, todayAppointments, calendarAppointments }) {
    const { auth } = usePage().props;
    const [calendarOpen, setCalendarOpen] = useState(false);

    const firstName = String(auth.user?.name ?? '').trim().split(/\s+/)[0] || 'there';

    return (
        <ClinicLayout>
            <Head title="Overview" />

            <div className="mx-auto w-full max-w-[1600px] space-y-6 px-5 py-10 lg:px-16">
                {/* Greeting */}
                <div className="flex flex-wrap items-end justify-between gap-4 pb-3">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-clinic-accent">{today.label}</p>
                        <h1 className="mt-3 text-[2.75rem] font-semibold leading-tight tracking-[-0.02em] text-clinic-ink">
                            {today.greeting}, {firstName}
                        </h1>
                        <p className="mt-3 text-[16px] text-slate-500">Here&rsquo;s what&rsquo;s happening at Dental Horizone today.</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setCalendarOpen(true)}
                        className="flex items-center gap-2.5 rounded-xl border border-clinic-line bg-white px-6 py-3.5 text-[15px] font-semibold text-clinic-ink shadow-sm transition hover:bg-slate-50"
                    >
                        <CalendarDays className="h-5 w-5" />
                        View calendar
                    </button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
                    <OverviewStatCard
                        label="Today's appointments"
                        value={stats.todays_appointments}
                        caption={`${stats.remaining_today} remaining today`}
                        icon={CalendarDays}
                        tone="blue"
                    />
                    <OverviewStatCard
                        label="Active patients"
                        value={stats.active_patients}
                        caption={`+${stats.new_patients_month} this month`}
                        icon={Users}
                        tone="green"
                    />
                    <OverviewStatCard
                        label="Pending requests"
                        value={stats.pending_requests}
                        caption="Needs your attention"
                        icon={Sparkles}
                        tone="orange"
                    />
                    <OverviewStatCard
                        label="Monthly revenue"
                        value={formatPeso(stats.monthly_revenue)}
                        caption={revenueCaption(stats.revenue_change, stats.previous_month_label)}
                        icon={Wallet}
                        tone="purple"
                    />
                </div>

                {/* Schedule + overview */}
                <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <TodaySchedule dateLabel={today.full} appointments={todayAppointments ?? []} />
                    <ClinicOverview activity={activity} />
                </div>
            </div>

            {calendarOpen && (
                <CalendarModal
                    appointments={calendarAppointments ?? []}
                    onClose={() => setCalendarOpen(false)}
                    initialFilter={null}
                />
            )}
        </ClinicLayout>
    );
}