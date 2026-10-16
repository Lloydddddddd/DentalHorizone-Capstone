const STYLES = {
    active: 'bg-[#e6f6f2] text-[#157a64]',
    inactive: 'bg-slate-100 text-slate-600',
    'follow-up': 'bg-[#f0ebf9] text-[#5b3fa8]',
    confirmed: 'bg-[#e6f6f2] text-[#157a64]',
    pending: 'bg-[#fdf1df] text-[#a5620d]',
    scheduled: 'bg-[#e8effb] text-clinic-blue',
    rescheduled: 'bg-[#f0ebf9] text-[#5b3fa8]',
    completed: 'bg-[#e8effb] text-clinic-blue',
    cancelled: 'bg-slate-100 text-slate-500',
    missed: 'bg-red-100 text-red-700',
};

export default function StatusPill({ status, className = '' }) {
    const key = String(status ?? '')
        .toLowerCase()
        .replace(/\s+/g, '-');
    const style = STYLES[key] ?? STYLES.inactive;
    const label = key
        ? key.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase())
        : '—';

    return (
        <span
            className={`inline-flex rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${style} ${className}`}
        >
            {label}
        </span>
    );
}