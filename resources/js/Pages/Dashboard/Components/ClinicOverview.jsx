import { Sparkles } from 'lucide-react';

const SEGMENTS = [
    { key: 'completed', label: 'Completed', color: '#2a5aa7' },
    { key: 'pending', label: 'Pending', color: '#e98b2a' },
    { key: 'cancelled', label: 'Cancelled', color: '#dde3ec' },
];

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Donut({ activity }) {
    const total = activity.total;
    let offset = 0;

    return (
        <div className="relative h-[11rem] w-[11rem] shrink-0">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
                {/* Track (also what an empty week looks like) */}
                <circle cx="64" cy="64" r={RADIUS} fill="none" stroke="#eef1f6" strokeWidth="13" />
                {total > 0 &&
                    SEGMENTS.map((segment) => {
                        const length = (activity[segment.key] / total) * CIRCUMFERENCE;
                        if (length <= 0) return null;
                        const circle = (
                            <circle
                                key={segment.key}
                                cx="64"
                                cy="64"
                                r={RADIUS}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="13"
                                strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                                strokeDashoffset={-offset}
                            />
                        );
                        offset += length;
                        return circle;
                    })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[38px] font-bold leading-none text-clinic-ink">{total}</span>
                <span className="mt-1.5 text-[13px] text-slate-400">Total visits</span>
            </div>
        </div>
    );
}

function trendText(change) {
    if (change === null || change === undefined) return null;
    if (change === 0) return { strong: 'Same number of visits', rest: 'as last week' };
    return {
        strong: `${Math.abs(change)}% ${change > 0 ? 'more' : 'fewer'} visits`,
        rest: 'than last week',
    };
}

export default function ClinicOverview({ activity }) {
    const trend = trendText(activity.change);

    return (
        <section className="flex h-full flex-col rounded-2xl border border-clinic-line bg-white shadow-[0_1px_2px_rgba(15,31,51,0.04)]">
            <header className="flex items-start justify-between border-b border-clinic-line px-7 py-6">
                <div>
                    <h2 className="text-[18px] font-semibold text-clinic-ink">Clinic overview</h2>
                    <p className="mt-1.5 text-[13px] text-slate-400">Appointment activity</p>
                </div>
                <span className="rounded-xl border border-clinic-line px-4 py-2 text-[13px] text-slate-500">This week</span>
            </header>

            <div className="flex flex-col gap-7 p-7">
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
                    <Donut activity={activity} />

                    <ul className="min-w-[10rem] flex-1 space-y-4">
                        {SEGMENTS.map((segment) => (
                            <li key={segment.key} className="flex items-center gap-3 text-[14px] text-slate-500">
                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                                <span className="flex-1">{segment.label}</span>
                                <span className="text-[15px] font-bold text-clinic-ink">{activity[segment.key]}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {trend && (
                    <div className="flex items-center gap-3 rounded-xl bg-[#edf7f3] px-5 py-4 text-[14px] text-[#2d7a63]">
                        <Sparkles className="h-5 w-5 shrink-0" />
                        <p>
                            <span className="font-bold">{trend.strong}</span> {trend.rest}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}