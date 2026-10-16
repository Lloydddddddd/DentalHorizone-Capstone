import { Link } from '@inertiajs/react';

const TONES = {
    blue: 'bg-[#eaf0fb] text-clinic-blue',
    green: 'bg-[#e6f6f2] text-[#1f9d7e]',
    orange: 'bg-[#fdf1e1] text-clinic-accent',
    purple: 'bg-[#f0ebf9] text-[#6b4fb3]',
};

export default function OverviewStatCard({ label, value, caption, icon: Icon, tone = 'blue', href }) {
    const card = 'flex items-center gap-5 rounded-2xl border border-clinic-line bg-white px-6 py-7 shadow-[0_1px_2px_rgba(15,31,51,0.04)]';

    const content = (
        <>
            <span className={`flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
                <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
                <p className="text-[14px] text-slate-500">{label}</p>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5">
                    <span className="text-[32px] font-bold leading-none text-clinic-ink">{value}</span>
                    {caption && <span className="text-[12px] text-slate-400">{caption}</span>}
                </div>
            </div>
        </>
    );

    return href ? (
        <Link href={href} className={`${card} transition hover:-translate-y-0.5 hover:shadow-md`}>
            {content}
        </Link>
    ) : (
        <div className={card}>{content}</div>
    );
}