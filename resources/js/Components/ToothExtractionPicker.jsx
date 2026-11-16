import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

const UPPER_TEETH = range(1, 16);
const LOWER_TEETH = range(17, 32);

const QUADRANTS = [
    { label: "Upper right", range: "1–8", teeth: range(1, 8) },
    { label: "Upper left", range: "9–16", teeth: range(9, 16) },
    { label: "Lower left", range: "17–24", teeth: range(17, 24) },
    { label: "Lower right", range: "25–32", teeth: range(25, 32) },
];

function sortTeeth(teeth = []) {
    return [...teeth].map(Number).sort((a, b) => a - b);
}

export default function ToothExtractionPicker({
    selected = [],
    onChange,
    disabled = false,
}) {
    const [openPanel, setOpenPanel] = useState(null);
    const containerRef = useRef(null);

    const selectedSet = new Set(selected.map(Number));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpenPanel(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTooth = (tooth) => {
        if (disabled) return;

        const next = selectedSet.has(tooth)
            ? selected.filter((t) => Number(t) !== tooth)
            : [...selected, tooth];

        onChange?.(sortTeeth(next));
    };

    const renderTrigger = (key, label, rangeLabel, teeth) => {
        const chosen = teeth.filter((t) => selectedSet.has(t));
        const isOpen = openPanel === key;

        return (
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpenPanel(isOpen ? null : key)}
                    disabled={disabled}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left transition ${
                        isOpen
                            ? "border-clinic-blue ring-2 ring-clinic-blue/15"
                            : "border-clinic-line hover:border-slate-300"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    <span className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {label} · {rangeLabel}
                        </span>
                        <span
                            className={`mt-0.5 block truncate text-[14px] font-semibold ${
                                chosen.length
                                    ? "text-clinic-ink"
                                    : "text-slate-500"
                            }`}
                        >
                            {chosen.length ? chosen.join(", ") : "Select tooth"}
                        </span>
                    </span>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                </button>

                {isOpen && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-clinic-line bg-white p-4 shadow-lg">
                        <p className="mb-3 text-[11px] text-slate-400">
                            Choose one or more teeth
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {teeth.map((tooth) => {
                                const isChosen = selectedSet.has(tooth);

                                return (
                                    <button
                                        key={tooth}
                                        type="button"
                                        onClick={() => toggleTooth(tooth)}
                                        disabled={disabled}
                                        aria-pressed={isChosen}
                                        className={`rounded-xl border py-3 text-[14px] font-semibold transition ${
                                            isChosen
                                                ? "border-clinic-blue bg-clinic-blue text-white"
                                                : "border-clinic-line bg-white text-clinic-ink hover:border-clinic-blue hover:bg-[#f5f8fd]"
                                        } disabled:cursor-not-allowed disabled:opacity-60`}
                                    >
                                        {tooth}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="mt-4 rounded-2xl border border-clinic-line bg-white p-5"
        >
            <h3 className="text-[15px] font-semibold text-clinic-ink">
                Teeth for extraction
            </h3>
            <p className="mt-1 text-[13px] text-slate-500">
                Select one or multiple teeth using the Universal Numbering
                System.
            </p>

            {/* Quadrant summary */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {QUADRANTS.map((quadrant) => {
                    const count = quadrant.teeth.filter((t) =>
                        selectedSet.has(t)
                    ).length;

                    return (
                        <div
                            key={quadrant.label}
                            className={`rounded-xl border px-3 py-2.5 text-center transition ${
                                count
                                    ? "border-clinic-blue bg-[#eaf0fb]"
                                    : "border-clinic-line bg-white"
                            }`}
                        >
                            <p className="text-[12px] font-semibold text-clinic-ink">
                                {quadrant.label}
                            </p>
                            <p
                                className={`mt-0.5 text-[11px] ${
                                    count
                                        ? "font-semibold text-clinic-blue"
                                        : "text-slate-500"
                                }`}
                            >
                                {count
                                    ? `${count} selected`
                                    : quadrant.range}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Upper / lower tooth dropdowns */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {renderTrigger("upper", "Upper teeth", "1–16", UPPER_TEETH)}
                {renderTrigger("lower", "Lower teeth", "17–32", LOWER_TEETH)}
            </div>

            {/* Selected chips */}
            {selected.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-clinic-line pt-3">
                    <span className="text-[12px] font-semibold text-slate-500">
                        Selected teeth:
                    </span>
                    {sortTeeth(selected).map((tooth) => (
                        <span
                            key={tooth}
                            className="rounded-md bg-[#eaf0fb] px-2 py-0.5 text-[12px] font-semibold text-clinic-blue"
                        >
                            {tooth}
                        </span>
                    ))}
                    <button
                        type="button"
                        onClick={() => onChange?.([])}
                        disabled={disabled}
                        className="ml-auto text-[12px] font-semibold text-slate-500 transition hover:text-red-500 disabled:opacity-60"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
