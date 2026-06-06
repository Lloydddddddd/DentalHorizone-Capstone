export const STATUS_COLORS = {
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

export const FILTER_LABELS = {
    missed:   { label: 'Missed',   color: 'bg-red-100 text-red-700' },
    today:    { label: 'Today',    color: 'bg-orange-100 text-orange-700' },
    upcoming: { label: 'Upcoming', color: 'bg-green-100 text-green-700' },
};