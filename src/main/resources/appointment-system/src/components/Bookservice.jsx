import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter, Clock, DollarSign, ChevronRight, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../auth/token";


const API_BASE = import.meta?.env?.VITE_API_BASE ?? "http://localhost:8080";
const API = {
    serviceTypes: () => `${API_BASE}/api/service-type`,
    services: () => `${API_BASE}/api/service/all`,
    providers: () => `${API_BASE}/api/all-providers`,
};

async function apiFetch(url, init = {}) {
    const token = auth.get?.();
    const headers = {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(url, { ...init, headers });


    if (!res.ok) {
        let body;
        try { body = await res.text(); } catch { body = ""; }
        console.error(`[apiFetch] ${res.status} ${url}`, body);
    }

    if (res.status === 401) {
        auth.clear?.();
        console.warn("[apiFetch] 401 Unauthorized. Token cleared.");
    }

    return res;
}


const cx = (...c) => c.filter(Boolean).join(" ");
const DEFAULT_CATEGORIES = ["All"];

function PageHeader({ onReset }) {
    return (
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">Book a Service</h1>
                <p className="text-sm text-slate-500">Choose from the available services below.</p>
            </div>
            <button
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-200 px-3 py-2 text-sm text-sky-700 hover:bg-sky-50"
            >
                <Filter className="h-4 w-4" /> Reset filters
            </button>
        </div>
    );
}

function Filters({ query, setQuery, category, setCategory, trainer, setTrainer, categories, trainers, disabled }) {
    return (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search services..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-sky-200/60 focus:ring disabled:opacity-60"
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="sm:col-span-3">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring focus:ring-sky-200/60 disabled:opacity-60"
                    disabled={disabled}
                >
                    {(categories?.length ? categories : DEFAULT_CATEGORIES).map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="sm:col-span-3">
                <select
                    value={trainer}
                    onChange={(e) => setTrainer(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring focus:ring-sky-200/60 disabled:opacity-60"
                    disabled={disabled}
                >
                    <option value="All">All Trainers</option>
                    {trainers.map((t) => (
                        <option key={t.id ?? t.name} value={t.id ?? t.name}>{t.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

function ServiceCard({ svc, trainer, onBook }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm/50 transition hover:shadow"
        >
            <div className="mb-2 flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-slate-800">{svc.title}</h3>
                {svc.category && (
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">{svc.category}</span>
                )}
            </div>
            {svc.description && <p className="mb-4 line-clamp-3 text-sm text-slate-600">{svc.description}</p>}
            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    {svc.durationMins != null && (
                        <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{svc.durationMins} mins</span>
                    )}
                    {svc.price != null && (
                        <span className="inline-flex items-center gap-1"><DollarSign className="h-4 w-4" />{svc.price}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {trainer?.name && <span className="text-xs text-slate-500">by {trainer.name}</span>}
                    <button
                        onClick={() => onBook(svc)}
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600"
                    >
                        Book Now <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function BookingDrawer({ open, onClose, service, trainersById }) {
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");

    const trainer = service ? trainersById[service.trainerId] : null;

    function confirm() {
        // TODO: Call POST /api/appointments when your endpoint is ready.
        if (!date || !slot) return alert("Please select date and time.");
        alert(`Booked: ${service.title} on ${date} at ${slot}`);
        onClose();
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/20"
                        onClick={onClose}
                    />
                    <motion.aside
                        key="drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                        className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-xl"
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Book: {service?.title}</h3>
                                <p className="text-xs text-slate-500">
                                    {trainer?.name ? `with ${trainer.name} • ` : ""}
                                    {service?.durationMins ? `${service.durationMins} mins • ` : ""}
                                    {service?.price != null ? `$${service.price}` : ""}
                                </p>
                            </div>
                            <button className="rounded-full p-2 text-slate-500 hover:bg-slate-50" onClick={onClose} aria-label="Close">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Calendar className="h-4 w-4" /> Select a date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setSlot("");
                                    }}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-200/60"
                                />
                            </div>

                            {/* Replace with real availability when endpoint is ready */}
                            {!!date && (
                                <div>
                                    <p className="mb-2 text-sm font-medium text-slate-700">Available time slots</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSlot(s)}
                                                className={cx(
                                                    "rounded-xl border px-3 py-2 text-sm",
                                                    slot === s ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                                )}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    onClick={confirm}
                                    disabled={!date || !slot}
                                    className={cx("w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm",
                                        !date || !slot ? "bg-slate-400" : "bg-sky-500 hover:bg-sky-600")}
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

// ---------------- Page: data wiring ----------------
export default function BookServicePage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [trainer, setTrainer] = useState("All");

    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // Load categories (service types)
    useEffect(() => {
        (async () => {
            try {
                // CHANGE: use apiFetch so Authorization header is added
                const res = await apiFetch(API.serviceTypes());
                if (res.ok) {
                    const types = await res.json(); // ["STRENGTH","CARDIO",...]
                    const pretty = types.map((t) => t.charAt(0) + t.slice(1).toLowerCase());
                    setCategories(["All", ...pretty]);
                }
            } catch (e) {
                console.error("service-type load error", e); // CHANGE: better visibility
            }
        })();
    }, []);

    // Load services & providers
    useEffect(() => {
        let abort = false;
        (async () => {
            setLoading(true);
            setErr("");
            try {
                // CHANGE: use apiFetch for both requests
                const [svcRes, provRes] = await Promise.allSettled([
                    apiFetch(API.services()),
                    apiFetch(API.providers()),
                ]);

                let svcList = [];
                if (svcRes.status === "fulfilled" && svcRes.value.ok) {
                    const raw = await svcRes.value.json(); // List<ServiceDTO>
                    // Map backend fields -> UI fields
                    svcList = raw.map((s) => ({
                        id: s.serviceId,
                        title: s.name,
                        description: s.description,
                        price: s.price,
                        durationMins: s.duration,
                        category: s.serviceType ? (String(s.serviceType).charAt(0) + String(s.serviceType).slice(1).toLowerCase()) : "",
                        // prefer flattened providerId; fallback to s.provider?.id if present
                        trainerId: s.providerId ?? s.provider?.id ?? null,
                        trainerName: (s.providerFirstName && s.providerLastName)
                            ? `${s.providerFirstName} ${s.providerLastName}`
                            : (s.provider ? `${s.provider.firstName ?? ""} ${s.provider.lastName ?? ""}`.trim() : ""),
                    }));
                }

                // Trainers list
                let trainerList = [];
                if (provRes.status === "fulfilled" && provRes.value.ok) {
                    const raw = await provRes.value.json(); // [{id, firstName, lastName}]
                    trainerList = raw.map((p) => ({
                        id: p.id, // may be undefined until you add it in backend fix
                        name: [p.firstName, p.lastName].filter(Boolean).join(" "),
                    }));
                }

                // If provider endpoint lacks ids, derive trainers from services (name only)
                if (!trainerList.length && svcList.length) {
                    const byName = new Map();
                    svcList.forEach((s) => {
                        const name = s.trainerName || "Unknown";
                        if (!byName.has(name)) byName.set(name, { id: s.trainerId ?? name, name });
                    });
                    trainerList = [...byName.values()];
                }

                if (!abort) {
                    setServices(svcList);
                    setTrainers(trainerList);
                }
            } catch (e) {
                if (!abort) setErr(e.message || "Failed to load data.");
            } finally {
                if (!abort) setLoading(false);
            }
        })();
        return () => { abort = true; };
    }, []);

    function handleReset() {
        setQuery("");
        setCategory("All");
        setTrainer("All");
    }

    function handleBook(svc) {
        setSelectedService(svc);
        setOpen(true);
    }

    const trainersById = useMemo(() => {
        const map = {};
        trainers.forEach((t) => { map[t.id ?? t.name] = t; });
        return map;
    }, [trainers]);

    // Filters (client-side because endpoints don’t accept filters yet)
    const filtered = useMemo(() => {
        return services.filter((s) => {
            const matchesQuery = [s.title, s.description].some((v) =>
                (v ?? "").toLowerCase().includes(query.toLowerCase())
            );
            const matchesCat = category === "All" || s.category === category;
            const matchesTrainer =
                trainer === "All" ||
                s.trainerId === trainer ||
                trainersById[s.trainerId]?.name === trainersById[trainer]?.name || // when ids missing
                s.trainerName === trainersById[trainer]?.name;
            return matchesQuery && matchesCat && matchesTrainer;
        });
    }, [services, query, category, trainer, trainersById]);

    return (
        <div className="p-6">
            <PageHeader onReset={handleReset} />
            <Filters
                query={query}
                setQuery={setQuery}
                category={category}
                setCategory={setCategory}
                trainer={trainer}
                setTrainer={setTrainer}
                categories={categories}
                trainers={trainers}
                disabled={loading}
            />

            {err && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{err}</div>}

            {loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
                    ))}
                </div>
            ) : filtered.length ? (
                <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <AnimatePresence>
                        {filtered.map((svc) => (
                            <ServiceCard
                                key={svc.id}
                                svc={svc}
                                trainer={trainersById[svc.trainerId] ?? (svc.trainerName ? { name: svc.trainerName } : null)}
                                onBook={handleBook}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                    <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-sky-50" />
                    <p className="text-slate-700">No services match your filters.</p>
                    <p className="text-sm text-slate-500">Try clearing filters or searching with a different term.</p>
                </div>
            )}

            <BookingDrawer
                open={open}
                onClose={() => setOpen(false)}
                service={selectedService}
                trainersById={trainersById}
            />
        </div>
    );
}
