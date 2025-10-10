import React from "react";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export default function WorkingDaysSelector({ value, onChange }) {
    const handleToggle = (day) => {
        const exists = value.find((d) => d.dayOfWeek === day);
        if (exists) onChange(value.filter((d) => d.dayOfWeek !== day));
        else onChange([...value, { dayOfWeek: day, startTime: "09:00", endTime: "17:00" }]);
    };

    const handleTimeChange = (day, field, time) => {
        onChange(value.map((d) => (d.dayOfWeek === day ? { ...d, [field]: time } : d)));
    };

    return (
        <section className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Working Days</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {DAYS.map((day) => {
                    const selected = value.find((d) => d.dayOfWeek === day);

                    return (
                        <div
                            key={day}
                            className={[
                                "flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition",
                                "focus-within:ring-1 focus-within:ring-sky-300",
                                selected ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white hover:bg-slate-50"
                            ].join(" ")}
                        >
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={!!selected}
                                    onChange={() => handleToggle(day)}
                                    className="h-4 w-4 rounded border-slate-300 accent-sky-600"
                                />
                                <span className="text-sm font-semibold text-slate-800">{day}</span>
                            </label>
                            {selected && (
                                <div className="ml-auto flex w-full items-center gap-2 md:w-auto md:flex-nowrap md:justify-end">
                                    <input
                                        type="time"
                                        value={selected.startTime}
                                        onChange={(e) => handleTimeChange(day, "startTime", e.target.value)}
                                        className="w-full md:w-[7.5rem] rounded-lg border border-slate-300 px-2 py-1 text-sm shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    />
                                    <span className="hidden text-slate-500 md:inline">–</span>
                                    <input
                                        type="time"
                                        value={selected.endTime}
                                        onChange={(e) => handleTimeChange(day, "endTime", e.target.value)}
                                        className="w-full md:w-[7.5rem] rounded-lg border border-slate-300 px-2 py-1 text-sm shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
