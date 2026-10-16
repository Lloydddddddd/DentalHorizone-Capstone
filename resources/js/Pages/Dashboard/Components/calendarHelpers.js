export const STATUS_COLORS = {
    pending:     { bg: 'bg-amber-500',   text: 'text-white', light: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-500',  btn: 'bg-amber-500 hover:bg-amber-600' },
    confirmed:   { bg: 'bg-emerald-500', text: 'text-white', light: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', btn: 'bg-emerald-500 hover:bg-emerald-600' },
    scheduled:   { bg: 'bg-blue-500',    text: 'text-white', light: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500',   btn: 'bg-blue-500 hover:bg-blue-600' },
    rescheduled: { bg: 'bg-purple-500',  text: 'text-white', light: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', btn: 'bg-purple-500 hover:bg-purple-600' },
    completed:   { bg: 'bg-blue-500',    text: 'text-white', light: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500',   btn: 'bg-blue-500 hover:bg-blue-600' },
    cancelled:   { bg: 'bg-slate-400',   text: 'text-white', light: 'bg-slate-50 text-slate-600 border-slate-200',    dot: 'bg-slate-400',  btn: 'bg-slate-400 hover:bg-slate-500' },
    missed:      { bg: 'bg-red-500',     text: 'text-white', light: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500',    btn: 'bg-red-500 hover:bg-red-600' },
    today:       { bg: 'bg-orange-500',  text: 'text-white', light: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', btn: 'bg-orange-500 hover:bg-orange-600' },
    upcoming:    { bg: 'bg-green-500',   text: 'text-white', light: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-500',  btn: 'bg-green-500 hover:bg-green-600' },
};

export const FILTER_LABELS = {
    missed:   { label: 'Missed',   color: 'bg-red-100 text-red-700' },
    today:    { label: 'Today',    color: 'bg-orange-100 text-orange-700' },
    upcoming: { label: 'Upcoming', color: 'bg-green-100 text-green-700' },
};