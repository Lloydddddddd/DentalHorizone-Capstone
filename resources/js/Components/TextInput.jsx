import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        variant = 'default',
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) localRef.current?.focus();
    }, [isFocused]);

    const base =
        variant === 'clinic'
            ? 'w-full rounded-xl border border-clinic-line bg-white px-4 py-3 text-[15px] text-clinic-ink placeholder:text-slate-400 focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15 disabled:bg-slate-50 disabled:text-slate-400'
            : 'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <input
            {...props}
            type={type}
            ref={localRef}
            className={`${base} ${className}`}
        />
    );
});