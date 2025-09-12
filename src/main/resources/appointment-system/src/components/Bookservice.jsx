import React, { useMemo, useState } from "react";
import { Search, Filter, Clock, DollarSign, ChevronRight, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---
const MOCK_SERVICES = [
    {
        id: "svc-1",
        title: "Personal Training Session",
        description:
            "1-on-1 session focused on strength, mobility, and form corrections. Includes a warm-up and cooldown plan.",
        durationMins: 60,
        price: 49,
        category: "Strength",
        trainerId: "tr-1",
    },
    {
        id: "svc-2",
        title: "HIIT Blast",
        description:
            "High-intensity interval training to boost endurance and burn calories. Suitable for intermediate levels.",
        durationMins: 45,
        price: 35,
        category: "Cardio",
        trainerId: "tr-2",
    },
    {
        id: "svc-3",
        title: "Mobility & Stretch",
        description:
            "Gentle guided mobility work and assisted stretching to improve flexibility and reduce soreness.",
        durationMins: 30,
        price: 25,
        category: "Recovery",
        trainerId: "tr-3",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-5",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-6",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-7",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
    {
        id: "svc-4",
        title: "Small Group Training",
        description:
            "Fun, social workout for up to 5 people. Strength + conditioning circuit led by a coach.",
        durationMins: 50,
        price: 29,
        category: "Group",
        trainerId: "tr-1",
    },
];

const MOCK_TRAINERS = [
    { id: "tr-1", name: "Alex Carter" },
    { id: "tr-2", name: "Maya Lopez" },
    { id: "tr-3", name: "Sam Fischer" },
];

const CATEGORIES = ["All", "Strength", "Cardio", "Recovery", "Group"];

// --- Utilities ---
const cx = (...classes) => classes.filter(Boolean).join(" ");

// --- Time Slots (Mock availability) ---
const BASE_SLOTS = [
    "06:00", "06:30", "07:00", "07:30",
    "08:00", "08:30", "09:00", "09:30",
    "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30",
];

function getMockSlots(dateStr) {
    // simple mock: weekends have fewer slots
    if (!dateStr) return [];
    const d = new Date(dateStr + "T00:00:00");
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    return BASE_SLOTS.filter((_, idx) => (isWeekend ? idx % 2 === 0 : true));
}

// --- Components ---
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

function Filters({ query, setQuery, category, setCategory, trainer, setTrainer }) {
    return (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search services..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-sky-200/60 focus:ring"
                    />
                </div>
            </div>

            <div className="sm:col-span-3">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring focus:ring-sky-200/60"
                >
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <div className="sm:col-span-3">
                <select
                    value={trainer}
                    onChange={(e) => setTrainer(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring focus:ring-sky-200/60"
                >
                    <option value="All">All Trainers</option>
                    {MOCK_TRAINERS.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
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
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">{svc.category}</span>
            </div>
            <p className="mb-4 line-clamp-3 text-sm text-slate-600">{svc.description}</p>
            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{svc.durationMins} mins</span>
                    <span className="inline-flex items-center gap-1"><DollarSign className="h-4 w-4" />{svc.price}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">by {trainer?.name}</span>
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

function BookingDrawer({ open, onClose, service }) {
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");

    const slots = useMemo(() => getMockSlots(date), [date]);
    const trainer = MOCK_TRAINERS.find((t) => t.id === service?.trainerId);

    function confirm() {
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
                                <p className="text-xs text-slate-500">with {trainer?.name} • {service?.durationMins} mins • ${service?.price}
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
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setSlot("");
                                    }}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-200/60"
                                />
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-slate-700">Available time slots</p>
                                {date ? (
                                    slots.length ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {slots.map((s) => (
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
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                                            No slots for this date.
                                        </div>
                                    )
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                                        Choose a date to see available times.
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={confirm}
                                    className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
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

export default function BookServicePage() {
    // Filters state
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [trainer, setTrainer] = useState("All");

    // Booking drawer state
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const filtered = useMemo(() => {
        return MOCK_SERVICES.filter((s) => {
            const matchesQuery = [s.title, s.description].some((v) =>
                v.toLowerCase().includes(query.toLowerCase())
            );
            const matchesCat = category === "All" || s.category === category;
            const matchesTrainer = trainer === "All" || s.trainerId === trainer;
            return matchesQuery && matchesCat && matchesTrainer;
        });
    }, [query, category, trainer]);

    function handleReset() {
        setQuery("");
        setCategory("All");
        setTrainer("All");
    }

    function handleBook(svc) {
        setSelectedService(svc);
        setOpen(true);
    }

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
            />

            {filtered.length ? (
                <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <AnimatePresence>
                        {filtered.map((svc) => (
                            <ServiceCard
                                key={svc.id}
                                svc={svc}
                                trainer={MOCK_TRAINERS.find((t) => t.id === svc.trainerId)}
                                onBook={handleBook}
                            />)
                        )}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                    <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-sky-50" />
                    <p className="text-slate-700">No services match your filters.</p>
                    <p className="text-sm text-slate-500">Try clearing filters or searching with a different term.</p>
                </div>
            )}

            <BookingDrawer open={open} onClose={() => setOpen(false)} service={selectedService} />
        </div>
    );
}
