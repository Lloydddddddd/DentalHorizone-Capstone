import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

/**
 * Searchable single-select dropdown.
 *
 * options: [{ value, label }]
 * onChange: (value, option) => void
 */
export default function SearchableSelect({
    options = [],
    value = "",
    onChange,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found",
    disabled = false,
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlighted, setHighlighted] = useState(-1);

    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const selected = useMemo(
        () => options.find((o) => String(o.value) === String(value)) || null,
        [options, value]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) =>
            String(o.label ?? "").toLowerCase().includes(q)
        );
    }, [options, query]);

    /* Close when clicking outside */
    useEffect(() => {
        if (!open) return;
        const handleClick = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    /* Reset search + focus the input when opening */
    useEffect(() => {
        if (!open) return;
        setQuery("");
        const selectedIndex = options.findIndex(
            (o) => String(o.value) === String(value)
        );
        setHighlighted(selectedIndex >= 0 ? selectedIndex : options.length ? 0 : -1);
        const timer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    /* Keep the highlight inside the filtered list */
    useEffect(() => {
        setHighlighted((current) => {
            if (!filtered.length) return -1;
            if (current < 0) return 0;
            return Math.min(current, filtered.length - 1);
        });
    }, [filtered.length]);

    /* Scroll the highlighted option into view */
    useEffect(() => {
        if (!open || highlighted < 0) return;
        const el = listRef.current?.querySelector(
            `[data-index="${highlighted}"]`
        );
        el?.scrollIntoView({ block: "nearest" });
    }, [highlighted, open]);

    const selectOption = (option) => {
        onChange?.(option.value, option);
        setOpen(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlighted((current) =>
                Math.min(current + 1, filtered.length - 1)
            );
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlighted((current) => Math.max(current - 1, 0));
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (filtered[highlighted]) selectOption(filtered[highlighted]);
        } else if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => !disabled && setOpen((current) => !current)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-clinic-line bg-white px-4 py-3 text-left text-[15px] text-clinic-ink transition focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
                <span className={`truncate ${selected ? "" : "text-slate-400"}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-clinic-line bg-white shadow-lg">
                    <div className="border-b border-clinic-line p-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    setHighlighted(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={searchPlaceholder}
                                className="w-full rounded-lg border border-clinic-line bg-slate-50 py-2 pl-9 pr-3 text-[14px] text-clinic-ink placeholder:text-slate-400 focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                            />
                        </div>
                    </div>

                    <ul
                        ref={listRef}
                        role="listbox"
                        className="max-h-60 overflow-y-auto py-1"
                    >
                        {filtered.length === 0 && (
                            <li className="px-4 py-6 text-center text-[13px] text-slate-400">
                                {emptyMessage}
                            </li>
                        )}

                        {filtered.map((option, index) => {
                            const isSelected =
                                String(option.value) === String(value);
                            const isHighlighted = index === highlighted;

                            return (
                                <li
                                    key={option.value}
                                    data-index={index}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseEnter={() => setHighlighted(index)}
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onClick={() => selectOption(option)}
                                    className={`flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-[14px] transition ${
                                        isHighlighted ? "bg-slate-100" : ""
                                    } ${
                                        isSelected
                                            ? "font-semibold text-clinic-navy"
                                            : "text-clinic-ink"
                                    }`}
                                >
                                    <span className="truncate">
                                        {option.label}
                                    </span>
                                    {isSelected && (
                                        <Check className="h-4 w-4 shrink-0 text-clinic-blue" />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
