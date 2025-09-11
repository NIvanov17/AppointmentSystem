import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

// --- Utilities -----------------------------------------------------------
const fmtTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmtDay = (date) =>
    date.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });

const isPast = (a, now = new Date()) => new Date(a.end) < now;

// --- Tiny UI Atoms -------------------------------------------------------
const Badge = ({ children, tone = "slate" }) => (
    <span
        className={
            `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ` +
            {
                slate: "bg-slate-50 text-slate-700 border-slate-200",
                green: "bg-green-50 text-green-700 border-green-200",
                red: "bg-rose-50 text-rose-700 border-rose-200",
                amber: "bg-amber-50 text-amber-700 border-amber-200",
                violet: "bg-violet-50 text-violet-700 border-violet-200",
            }[tone]
        }
    >
        {children}
    </span>
);

const Card = ({ children, className = "" }) => (
    <div className={`rounded-2xl bg-white shadow-sm ring-1 ring-black/5 ${className}`}>{children}</div>
);

// --- Main Component ------------------------------------------------------
const tabs = ["Upcoming", "Past", "Custom Date"];

export default function ProvidersAppointments({ appointments = [] }) {
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [query, setQuery] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const now = new Date();

    const filtered = useMemo(() => {
        let list = appointments
            .slice()
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        // search filter
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter((a) =>
                [a.title, a.customer, a.recruiter, a.bookingId]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(q))
            );
        }

        if (activeTab === "Upcoming") {
            list = list.filter((a) => !isPast(a, now));
        } else if (activeTab === "Past") {
            list = list.filter((a) => isPast(a, now));
            list.reverse(); // show most recent past first
        } else if (activeTab === "Custom Date") {
            const fromDate = from ? new Date(from + "T00:00:00") : undefined;
            const toDate = to ? new Date(to + "T23:59:59") : undefined;
            list = list.filter((a) => {
                const s = new Date(a.start);
                return (!fromDate || s >= fromDate) && (!toDate || s <= toDate);
            });
        }

        return list;
    }, [appointments, activeTab, query, from, to]);

    return (
        <div className="flex h-full w-full flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800">Appointments</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by title, customer, ID..."
                            className="h-10 w-64 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                    <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-900">
                        New Appointment
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <Card>
                <div className="border-b border-slate-200">
                    <div className="flex items-center gap-1 px-3">
                        {tabs.map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`relative px-3 py-2 text-sm font-medium text-slate-600 transition ${activeTab === t ? "text-slate-900" : "hover:text-slate-900"
                                    }`}
                            >
                                {t}
                                {activeTab === t && (
                                    <motion.div
                                        layoutId="tab-underline"
                                        className="absolute inset-x-2 -bottom-px h-0.5 bg-slate-900"
                                    />
                                )}
                            </button>
                        ))}
                        <div className="ml-auto flex items-center gap-2 py-2">
                            {activeTab === "Custom Date" && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
                                    />
                                    <span className="text-slate-400 text-sm">to</span>
                                    <input
                                        type="date"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            setFrom("");
                                            setTo("");
                                        }}
                                        className="h-9 rounded-lg border border-slate-200 px-3 text-sm hover:bg-slate-50"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <div className="col-span-3">Time</div>
                    <div className="col-span-2">Booking ID</div>
                    <div className="col-span-3">Title</div>
                    <div className="col-span-2">Recruiter / Customer</div>
                    <div className="col-span-1">Price</div>
                    <div className="col-span-1 text-right">Status</div>
                </div>

                {/* Rows */}
                <AnimatePresence mode="popLayout">
                    {groupByDay(filtered).map(({ day, items }) => (
                        <motion.div key={day} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="border-t border-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                {fmtDay(new Date(day))}
                            </div>
                            {items.map((a) => (
                                <Row key={a.id} a={a} />
                            ))}
                        </motion.div>
                    ))}

                    {filtered.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-12 text-center text-slate-500">
                            No appointments to show.
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
}

function Row({ a }) {
    const start = new Date(a.start);
    const end = new Date(a.end);

    const statusTone = {
        Scheduled: "violet",
        Completed: "green",
        Cancelled: "red",
        "No-show": "amber",
    };

    return (
        <div className="grid grid-cols-12 gap-2 border-t border-slate-100 px-4 py-3 text-sm hover:bg-slate-50/50">
            <div className="col-span-3 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <div className="tabular-nums text-slate-700">
                    {fmtTime(start)} – {fmtTime(end)}
                </div>
            </div>
            <div className="col-span-2 text-slate-600">{a.bookingId}</div>
            <div className="col-span-3 font-medium text-slate-800">{a.title}</div>
            <div className="col-span-2 text-slate-600">
                <div className="truncate">{a.recruiter || "—"}</div>
                <div className="truncate text-slate-400 text-xs">{a.customer || ""}</div>
            </div>
            <div className="col-span-1 text-slate-700">{a.price || (a.paymentStatus === "Free" ? "Free" : a.paymentStatus)}</div>
            <div className="col-span-1 text-right">
                <Badge tone={statusTone[a.status]}>{a.status}</Badge>
            </div>
        </div>
    );
}

// --- Helper: group by day ------------------------------------------------
function groupByDay(list) {
    const map = new Map();
    for (const a of list) {
        const d = new Date(a.start);
        const dayKey = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
        map.set(dayKey, [...(map.get(dayKey) || []), a]);
    }
    return Array.from(map.entries())
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([day, items]) => ({ day, items }));
}

// --- Demo (optional) -----------------------------------------------------
export function DemoPage() {
    const sample = [
        {
            id: "1",
            bookingId: "TE-00001",
            title: "Recruitment Strategy Meeting",
            start: new Date().toISOString().slice(0, 10) + "T09:15:00",
            end: new Date().toISOString().slice(0, 10) + "T09:45:00",
            recruiter: "Blagovest Papazov",
            customer: "gosho",
            price: "Free",
            paymentStatus: "Free",
            status: "Completed",
        },
        {
            id: "2",
            bookingId: "TE-00002",
            title: "Initial Screening Call",
            start: addDaysISO(new Date(), 2).slice(0, 19),
            end: addDaysISO(new Date(), 2, 30).slice(0, 19),
            recruiter: "Maria Petrova",
            customer: "Acme Corp",
            price: "$0",
            paymentStatus: "Free",
            status: "Scheduled",
        },
        {
            id: "3",
            bookingId: "TE-00003",
            title: "Follow-up Interview",
            start: addDaysISO(new Date(), -5).slice(0, 19),
            end: addDaysISO(new Date(), -5, 45).slice(0, 19),
            recruiter: "Ivan Dimitrov",
            customer: "Acme Corp",
            price: "$49",
            paymentStatus: "Paid",
            status: "Completed",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <ProvidersAppointments appointments={sample} />
        </div>
    );
}

function addDaysISO(date, days = 0, minutes = 0) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString();
}
