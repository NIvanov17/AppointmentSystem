import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Clock, DollarSign, ChevronRight, Calendar, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../auth/token";


const API_BASE = import.meta?.env?.VITE_API_BASE ?? "http://localhost:8080";
const API = {
    serviceTypes: () => `${API_BASE}/api/service-type`,
    services: () => `${API_BASE}/api/service/all`,
    availableSlots: () => `${API_BASE}/api/appointments/available-slots`,
    appointment: () => `${API_BASE}/api/appointment`,
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
                    <option value="All">All Providers</option>
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
function resolveProviderId(service, trainersById) {
    if (!service) return null;

    // direct fields from service
    const direct =
        service.trainerId ??
        service.providerId ??
        (service.provider && service.provider.id);

    if (direct != null) return direct;

    if (service.trainerName && trainersById) {
        if (trainersById[service.trainerName]?.id != null) {
            return trainersById[service.trainerName].id;
        }
        const match = Object.values(trainersById).find(
            (t) => t && t.name === service.trainerName
        );
        if (match?.id != null) return match.id;
    }

    return null;
}

function BookingDrawer({ open, onClose, service, trainersById }) {
    const [successOpen, setSuccessOpen] = useState(false);
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");

    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState("");

    const [booking, setBooking] = useState(false);
    const [bookingError, setBookingError] = useState("");

    const providerId = resolveProviderId(service, trainersById);
    const durationMinutes = service?.durationMinutes ?? service?.durationMins;

    const todayISO = new Date().toISOString().split("T")[0];

    function slotToMinutes(s) {
        const [hh = "0", mm = "0"] = s.split(":");
        return parseInt(hh, 10) * 60 + parseInt(mm, 10);
    }

    const filteredSlots = React.useMemo(() => {
        if (!Array.isArray(slots) || slots.length === 0) return [];
        if (!date || date !== todayISO) return slots;

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();


        return slots.filter((s) => slotToMinutes(s) > nowMinutes);
    }, [slots, date, todayISO]);

    useEffect(() => {
        if (slot && !filteredSlots.includes(slot)) {
            setSlot("");
        }
    }, [filteredSlots, slot]);

    useEffect(() => {
        if (!open || !date || !service?.id) {
            setSlots([]);
            setSlotsError("");
            return;
        }

        const controller = new AbortController();

        (async () => {
            try {
                setLoadingSlots(true);
                setSlotsError("");
                setSlot("");

                const params = new URLSearchParams({
                    serviceId: String(service.id),
                    date, // "YYYY-MM-DD"
                    t: String(Date.now()),
                });

                const res = await apiFetch(`${API.availableSlots()}?${params.toString()}`, {
                    method: "GET",
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                });

                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error(msg || `Failed to load slots (${res.status})`);
                }

                const data = await res.json();
                setSlots(Array.isArray(data.slots) ? data.slots : []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setSlotsError(err.message || "Could not load availability.");
                }
            } finally {
                setLoadingSlots(false);
            }
        })();

        return () => controller.abort();
    }, [date, service?.id, open]);

    async function confirm() {
        if (!date || !slot) {
            alert("Please select date and time.");
            return;
        }

        console.log("[confirm] service:", service);
        console.log("[confirm] trainersById:", trainersById);
        console.log("[confirm] resolved providerId:", providerId);
        if (service?.id == null || providerId == null) {
            alert("Missing service/provider info.");
            return;
        }

        try {
            setBooking(true);
            setBookingError("");

            const maybeClientId =
                typeof auth?.getUserId === "function" ? auth.getUserId() : undefined;

            const startAt = `${date}T${slot}:00`;
            console.debug("[confirm] service:", service);
            console.debug("[confirm] providerId:", providerId);

            const payload = {
                serviceId: service.id,
                providerId,
                startAt,
                ...(maybeClientId ? { clientId: maybeClientId } : {}),
            };

            const res = await apiFetch(API.appointment(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `Booking failed (${res.status})`);
            }

            onClose?.();
            setSuccessOpen(true);
        } catch (err) {
            setBookingError(err.message || "Booking failed.");
        } finally {
            setBooking(false);
        }
    }

    return (
        <>
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
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Book: {service?.title ?? service?.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {durationMinutes ? `${durationMinutes} mins` : ""}
                                        {service?.price != null ? ` • $${service.price}` : ""}
                                    </p>
                                </div>
                                <button
                                    className="rounded-full p-2 text-slate-500 hover:bg-slate-50"
                                    onClick={onClose}
                                    aria-label="Close"
                                >
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
                                        min={todayISO}
                                        onChange={(e) => {
                                            setDate(e.target.value);
                                            setSlot("");
                                        }}
                                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-200/60"
                                    />
                                </div>

                                {!!date && (
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="text-sm font-medium text-slate-700">Available time slots</p>
                                            {loadingSlots && <span className="text-xs text-slate-500">Loading…</span>}
                                        </div>

                                        {slotsError && (
                                            <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                                                {slotsError}
                                            </div>
                                        )}

                                        {!loadingSlots && !slotsError && filteredSlots.length === 0 && (
                                            <p className="text-sm text-slate-500">
                                                {date === todayISO
                                                    ? "No future time slots left today."
                                                    : "No free time slots for this date."}
                                            </p>
                                        )}

                                        {!loadingSlots && !slotsError && filteredSlots.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {filteredSlots.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setSlot(s)}
                                                        className={cx(
                                                            "rounded-xl border px-3 py-2 text-sm",
                                                            slot === s
                                                                ? "border-sky-500 bg-sky-50 text-sky-700"
                                                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {bookingError && (
                                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                                        {bookingError}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        onClick={confirm}
                                        disabled={!date || !slot || booking || loadingSlots || !!slotsError}
                                        className={cx(
                                            "w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm",
                                            !date || !slot || booking || loadingSlots || !!slotsError
                                                ? "bg-slate-400"
                                                : "bg-sky-500 hover:bg-sky-600"
                                        )}
                                    >
                                        {booking ? "Booking…" : "Confirm Booking"}
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <SuccessDialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                redirectTo="/app/clients/appointments"
                delayMs={2500}
            />
        </>
    );
}


function SuccessDialog({ open, onClose, redirectTo = "/app/clients/appointments", delayMs = 2500 }) {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!open) return;
        let start = performance.now();
        let raf = 0;

        const tick = (t) => {
            const pct = Math.min(1, (t - start) / delayMs);
            setProgress(pct);
            if (pct < 1) raf = requestAnimationFrame(tick);
            else {
                onClose?.();
                navigate(redirectTo);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [open, delayMs, redirectTo, navigate, onClose]);

    const deg = Math.round(progress * 360);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/40"
                    />
                    <motion.div
                        initial={{ y: 40, opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        className="fixed inset-0 z-[70] grid place-items-center p-4"
                    >
                        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="mx-auto mb-4 grid place-items-center">
                                <div
                                    className="relative grid place-items-center rounded-full p-1"
                                    style={{
                                        width: 96,
                                        height: 96,
                                        backgroundImage: `conic-gradient(currentColor ${deg}deg, #e5e7eb ${deg}deg)`,
                                        color: "rgb(14 165 233)",
                                    }}
                                >
                                    <div className="grid place-items-center rounded-full bg-white" style={{ width: 80, height: 80 }}>
                                        <motion.div
                                            initial={{ scale: 0, rotate: -15, opacity: 0 }}
                                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.05 }}
                                            className="grid place-items-center rounded-full bg-sky-50"
                                            style={{ width: 64, height: 64 }}
                                        >
                                            <Check className="h-9 w-9 text-sky-600" strokeWidth={2.5} />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-center text-lg font-semibold text-slate-800">Appointment confirmed</h4>
                            <p className="mt-1 text-center text-sm text-slate-600">
                                You’ll be redirected to <span className="font-medium">My Appointments</span> in a moment…
                            </p>

                            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full bg-sky-500 transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
                            </div>

                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => {
                                        onClose?.();
                                        navigate(redirectTo);
                                    }}
                                    className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
                                >
                                    Go now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

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

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch(API.serviceTypes());
                if (res.ok) {
                    const types = await res.json();
                    const pretty = types.map((t) => t.charAt(0) + t.slice(1).toLowerCase());
                    setCategories(["All", ...pretty]);
                }
            } catch (e) {
                console.error("service-type load error", e);
            }
        })();
    }, []);

    useEffect(() => {
        let abort = false;
        (async () => {
            setLoading(true);
            setErr("");
            try {
                const [svcRes, provRes] = await Promise.allSettled([
                    apiFetch(API.services()),
                    apiFetch(API.providers()),
                ]);

                let svcList = [];
                if (svcRes.status === "fulfilled" && svcRes.value.ok) {
                    const raw = await svcRes.value.json();
                    svcList = raw.map((s) => ({
                        id: s.serviceId,
                        title: s.name,
                        description: s.description,
                        price: s.price,
                        durationMins: s.duration,
                        category: s.serviceType ? (String(s.serviceType).charAt(0) + String(s.serviceType).slice(1).toLowerCase()) : "",
                        trainerId: s.providerId ?? s.provider?.id ?? null,
                        trainerName: (s.providerFirstName && s.providerLastName)
                            ? `${s.providerFirstName} ${s.providerLastName}`
                            : (s.provider ? `${s.provider.firstName ?? ""} ${s.provider.lastName ?? ""}`.trim() : ""),
                    }));
                }


                let trainerList = [];
                if (provRes.status === "fulfilled" && provRes.value.ok) {
                    const raw = await provRes.value.json();
                    trainerList = raw.map((p) => ({
                        id: p.id,
                        name: [p.firstName, p.lastName].filter(Boolean).join(" "),
                    }));
                }

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

    const filtered = useMemo(() => {
        return services.filter((s) => {
            const matchesQuery = [s.title, s.description].some((v) =>
                (v ?? "").toLowerCase().includes(query.toLowerCase())
            );
            const matchesCat = category === "All" || s.category === category;
            const matchesTrainer =
                trainer === "All" ||
                s.trainerId === trainer ||
                trainersById[s.trainerId]?.name === trainersById[trainer]?.name ||
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
