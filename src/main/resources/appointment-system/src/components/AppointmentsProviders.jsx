import React, { useEffect, useMemo, useState } from "react";
import { auth } from "../auth/token";

const API_BASE = import.meta?.env?.VITE_API_BASE ?? "http://localhost:8080";
const API = {
    allAppointments: () => `${API_BASE}/api/provider/appointments/all`,
};

async function apiFetch(url, init = {}) {
    if (typeof window !== "undefined" && typeof window.apiFetch === "function") {
        return window.apiFetch(url, init);
    }
    const token = auth?.get?.();
    const headers = {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(url, { ...init, headers });
    if (!res.ok) {
        let body = "";
        try {
            body = await res.text();
        } catch { }
        console.error(`[apiFetch] ${res.status} ${url}`, body);
    }
    if (res.status === 401) {
        auth?.clear?.();
        console.warn("[apiFetch] 401 Unauthorized. Token cleared.");
    }
    return res;
}

async function getAllAppointments(signal) {
    const url = `${API.allAppointments()}?t=${Date.now()}`;
    const res = await apiFetch(url, {
        method: "GET",
        signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
    });
    if (!res.ok) throw new Error((await res.text()) || `Error ${res.status}`);
    return res.json();
}

const fmtDateTime = (dt) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(dt)
    );

const fmtPrice = (n) =>
    typeof n === "number"
        ? new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(n)
        : n;

const byAscStart = (a, b) =>
    new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
const byDescStart = (a, b) =>
    new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime();

function usePartitioned(appointments) {
    const now = Date.now();
    return useMemo(() => {
        const upcoming = [];
        const past = [];
        for (const a of appointments) {
            const endMs = new Date(a.endDateTime).getTime();
            (endMs < now ? past : upcoming).push(a);
        }
        upcoming.sort(byAscStart);
        past.sort(byDescStart);
        return { upcoming, past, all: [...upcoming, ...past] };
    }, [appointments]);
}

const TABS = [
    { key: "upcoming", label: "Upcoming" },
    { key: "all", label: "All" },
    { key: "past", label: "Past" },
];

export default function ProviderAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmId, setConfirmId] = useState(null);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true);
                setError("");
                const json = await getAllAppointments(controller.signal);
                setAppointments(Array.isArray(json) ? json : []);
            } catch (e) {
                if (e.name !== "AbortError") setError(e.message || "Failed to load appointments");
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    const { upcoming, past, all } = usePartitioned(appointments);
    const rows = activeTab === "upcoming" ? upcoming : activeTab === "past" ? past : all;

    const Empty = ({ title, note }) => (
        <div className="p-12 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 ring-1 ring-inset ring-slate-200">
                <span className="text-3xl">📅</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            <p className="text-slate-500">{note}</p>
        </div>
    );

    if (loading) return <div className="p-6 text-slate-500 animate-pulse">Loading appointments…</div>;
    if (error) return <div className="p-6 text-rose-600">{error}</div>;

    return (
        <div className="p-6 w-full max-w-screen-2xl mx-auto">
            {notice && (
                <div className="mb-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition">
                    {notice}
                </div>
            )}

            <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Provider Appointments</h1>
                    <p className="text-slate-600 text-sm">
                        {activeTab === "all"
                            ? `Upcoming first · ${appointments.length} total`
                            : activeTab === "upcoming"
                                ? `${upcoming.length} upcoming`
                                : `${past.length} past`}
                    </p>
                </div>
            </div>

            <div role="tablist" aria-label="Appointment filters" className="mb-4">
                <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    {TABS.map((t) => {
                        const active = activeTab === t.key;
                        return (
                            <button
                                key={t.key}
                                role="tab"
                                aria-selected={active}
                                onClick={() => setActiveTab(t.key)}
                                className={[
                                    "relative px-4 py-2 text-sm font-medium rounded-xl transition",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                                    active
                                        ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sm"
                                        : "text-slate-700 hover:bg-slate-50 active:scale-[.98]",
                                ].join(" ")}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {rows.length === 0 ? (
                activeTab === "upcoming" ? (
                    <Empty title="No upcoming appointments" note="New bookings will show up here." />
                ) : activeTab === "past" ? (
                    <Empty title="No past appointments" note="Once appointments end, they’ll be listed here." />
                ) : (
                    <Empty title="No appointments yet" note="They will appear here once scheduled." />
                )
            ) : (
                <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full min-w-[720px] table-fixed text-left">
                        <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60">
                            <tr className="border-b border-slate-200">
                                <Th>Name</Th>
                                <Th>Duration</Th>
                                <Th>Price</Th>
                                <Th>Service Type</Th>
                                <Th>Start</Th>
                                <Th>End</Th>
                                {activeTab === "all" && <Th>Status</Th>}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((appt) => {
                                const isPast = new Date(appt.endDateTime).getTime() < Date.now();
                                return (
                                    <tr
                                        key={appt.id}
                                        className={[
                                            "odd:bg-white even:bg-slate-50/40",
                                            "transition-colors hover:bg-sky-50/60 focus-within:bg-sky-50/60",
                                        ].join(" ")}
                                    >
                                        <Td className="font-medium text-slate-900">{appt.name}</Td>
                                        <Td>{appt.durationInMinutes} min</Td>
                                        <Td>{fmtPrice(appt.price)}</Td>
                                        <Td>{String(appt.serviceType)}</Td>
                                        <Td>{fmtDateTime(appt.startDateTime)}</Td>
                                        <Td>{fmtDateTime(appt.endDateTime)}</Td>

                                        {activeTab === "all" && (
                                            <Td>
                                                <span
                                                    className={[
                                                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                                                        isPast
                                                            ? "bg-rose-50 text-rose-700 ring-rose-200"
                                                            : "bg-emerald-50 text-emerald-700 ring-emerald-200 animate-pulse",
                                                    ].join(" ")}
                                                >
                                                    <span
                                                        className={["h-1.5 w-1.5 rounded-full", isPast ? "bg-rose-500" : "bg-emerald-500"].join(" ")}
                                                    />
                                                    {isPast ? "Past" : "Upcoming"}
                                                </span>
                                            </Td>
                                        )}


                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {confirmId && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40" onClick={() => !deleting && setConfirmId(null)} />
                    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900">Delete appointment?</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            This action cannot be undone. The reservation will be permanently removed.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmId(null)}
                                disabled={deleting}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!confirmId) return;
                                    setDeleting(true);
                                    const previous = appointments;
                                    setAppointments((prev) => prev.filter((a) => a.id !== confirmId));
                                    try {
                                        await deleteAppointment(confirmId);
                                        setNotice("Appointment deleted.");
                                        setConfirmId(null);
                                    } catch (e) {
                                        setAppointments(previous); // rollback
                                        setNotice(e.message || "Failed to delete appointment.");
                                        setConfirmId(null);
                                    } finally {
                                        setDeleting(false);
                                        setTimeout(() => setNotice(""), 3000);
                                    }
                                }}
                                disabled={deleting}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-50"
                            >
                                {deleting ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Th({ children }) {
    return (
        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
            {children}
        </th>
    );
}
function Td({ children, className = "" }) {
    return <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>{children}</td>;
}
