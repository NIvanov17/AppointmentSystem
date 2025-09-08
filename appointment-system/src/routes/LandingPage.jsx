import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoPng from "../assets/logo_ready.png";
import { auth } from "../auth/token";

export default function LandingPage() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <SiteNav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            {/* Hero */}
            <section className="relative overflow-hidden">
                {/* decorative shapes */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-3xl bg-sky-100 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-100 blur-2xl" />

                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24 lg:gap-16 lg:px-8">
                    {/* copy side */}
                    <div>
                        <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">Scheduling platform</span>
                        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Appointment
                            <br />
                            Scheduling <span className="whitespace-nowrap">for Free</span>
                        </h1>
                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                            Schedule bookings, improve your services, promote your business, and send client reminders — all in one place.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            {/* internal navigation → use Link to avoid full reload */}
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                Get started for free
                            </Link>
                            <a
                                href="#demo"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                View demo
                            </a>
                        </div>

                        {/* social proof */}
                        <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center -space-x-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="inline-block h-8 w-8 rounded-full bg-slate-200" />
                                ))}
                            </div>
                            <span>Trusted by 5,000+ businesses</span>
                        </div>
                    </div>

                    {/* imagery side */}
                    <div className="relative">
                        <div className="relative mx-auto w/full max-w-xl">
                            {/* back diamond */}
                            <div className="absolute -left-6 -top-6 h-16 w-16 rotate-45 rounded-md bg-sky-200" />

                            {/* main screenshot card */}
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                <img
                                    src="/hero-calendar.png"
                                    alt="Calendar and booking dashboard"
                                    className="h-auto w-full object-cover"
                                />
                            </div>

                            {/* foreground round photo card */}
                            <div className="absolute -bottom-10 -right-6 w-40 sm:w-48 md:w-56">
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                                    <img
                                        src="/hero-mobile.png"
                                        alt="Mobile booking preview"
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value section */}
            <section className="bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Manage your business easily</h2>
                        <p className="mt-4 text-slate-600">
                            Centralize bookings, keep your calendar organized, and make it simple for clients to find and schedule your services.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((f) => (
                            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                                    <f.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-semibold">{f.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 p-8 md:grid-cols-2 md:p-12">
                        <div>
                            <h3 className="text-2xl font-bold">Start accepting bookings today</h3>
                            <p className="mt-3 text-slate-600">Create your booking page, add services, and share your link. It takes minutes.</p>
                        </div>
                        <div className="flex justify-start md:justify-end">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                Create free account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}

function SiteNav({ mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();

    // keep nav reactive to login/logout
    const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn());
    useEffect(() => {
        const onAuthChange = () => setIsLoggedIn(auth.isLoggedIn());
        window.addEventListener("auth:change", onAuthChange);
        window.addEventListener("storage", onAuthChange); // cross-tab sync if using localStorage
        return () => {
            window.removeEventListener("auth:change", onAuthChange);
            window.removeEventListener("storage", onAuthChange);
        };
    }, []);

    const handleLogout = () => {
        auth.clear();
        window.dispatchEvent(new Event("auth:change"));
        navigate("/", { replace: true });
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                <div className="flex items-center gap-3">
                    <img src={logoPng} alt="Company logo" className="h-8 w-auto" />
                    <span className="text-lg font-extrabold tracking-tight">Reserv</span>
                </div>

                <nav className="hidden items-center gap-8 md:flex">
                    <a className="text-sm font-medium text-slate-700 hover:text-slate-900" href="#products">Products</a>
                    <a className="text-sm font-medium text-slate-700 hover:text-slate-900" href="#solutions">Solutions</a>
                    <a className="text-sm font-medium text-slate-700 hover:text-slate-900" href="#pricing">Pricing</a>
                    <a className="text-sm font-medium text-slate-700 hover:text-slate-900" href="#resources">Resources</a>
                </nav>

                {/* desktop actions */}
                <div className="hidden items-center gap-3 md:flex">
                    {isLoggedIn ? (
                        <>
                            <Link className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" to="/app">
                                Open app
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" to="/login">
                                Log in
                            </Link>
                            <Link className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700" to="/register">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                {/* mobile toggle */}
                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-slate-100"
                    aria-label="Toggle menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M3 6h18M3 12h18M3 18h18" />
                    </svg>
                </button>
            </div>

            {/* mobile menu */}
            {mobileOpen && (
                <div className="border-t border-slate-200 bg-white md:hidden">
                    <div className="mx-auto max-w-7xl px-6 py-4">
                        <div className="grid gap-3">
                            <a className="rounded-lg px-2 py-2 text-slate-700 hover:bg-slate-100" href="#products">Products</a>
                            <a className="rounded-lg px-2 py-2 text-slate-700 hover:bg-slate-100" href="#solutions">Solutions</a>
                            <a className="rounded-lg px-2 py-2 text-slate-700 hover:bg-slate-100" href="#pricing">Pricing</a>
                            <a className="rounded-lg px-2 py-2 text-slate-700 hover:bg-slate-100" href="#resources">Resources</a>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            {isLoggedIn ? (
                                <>
                                    <Link className="w-full rounded-xl px-4 py-2 text-center font-semibold text-slate-700 hover:bg-slate-100" to="/app">
                                        Open app
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-center font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link className="w-full rounded-xl px-4 py-2 text-center font-semibold text-slate-700 hover:bg-slate-100" to="/login">
                                        Log in
                                    </Link>
                                    <Link className="w-full rounded-xl bg-sky-600 px-4 py-2 text-center font-semibold text-white hover:bg-sky-700" to="/register">
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

function SiteFooter() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 lg:flex-row lg:px-8">
                <p>© {new Date().getFullYear()} Reserv, Inc. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <a href="#privacy" className="hover:text-slate-700">Privacy</a>
                    <a href="#terms" className="hover:text-slate-700">Terms</a>
                    <a href="#contact" className="hover:text-slate-700">Contact</a>
                </div>
            </div>
        </footer>
    );
}

// simple lucide-like icons (inline SVG to avoid deps)
const IconCalendar = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);
const IconBell = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" {...props}>
        <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);
const IconCreditCard = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" {...props}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
    </svg>
);

const features = [
    {
        title: "Smart calendar",
        desc: "Keep your availability synced and avoid double-bookings across your team.",
        icon: IconCalendar,
    },
    {
        title: "Automated reminders",
        desc: "Reduce no-shows with email and SMS reminders your clients appreciate.",
        icon: IconBell,
    },
    {
        title: "Online payments",
        desc: "Securely accept deposits or full payments right from the booking page.",
        icon: IconCreditCard,
    },
];
