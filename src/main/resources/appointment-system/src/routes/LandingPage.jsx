import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoPng from "../assets/logo_ready.png";
import { auth } from "../auth/token";
import heroDashboard from "../assets/Dashboard.png";
import heroAppointments from "../assets/Appointments.png";
import heroMobile from "../assets/Mobile.png";

const getAppPath = (role) => (role === "PROVIDER" ? "/app/providers" : "/app/clients");

const IconCalendar = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        className="h-5 w-5" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconUsers = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        className="h-5 w-5" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="8" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M17 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconLink = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        className="h-5 w-5" {...props}>
        <path d="M15 7h3a5 5 0 1 1 0 10h-3" />
        <path d="M9 17H6a5 5 0 1 1 0-10h3" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const features = [
    {
        title: "Smart calendar",
        desc: "Keep your availability synced and avoid double-bookings across your team.",
        icon: IconCalendar,
    },
    {
        title: "Public booking page",
        desc: "Share a link so clients can book available slots without back-and-forth.",
        icon: IconLink,
    },
    {
        title: "Multiple providers & services",
        desc: "Manage teams, working hours, and service durations per provider.",
        icon: IconUsers,
    },
];


export default function LandingPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn());
    const [role, setRole] = useState(auth.getRole?.() || "");
    const appPath = useMemo(() => getAppPath(role), [role]);

    useEffect(() => {
        const onAuthChange = () => {
            setIsLoggedIn(auth.isLoggedIn());
            setRole(auth.getRole?.() || "");
        };
        window.addEventListener("auth:change", onAuthChange);
        window.addEventListener("storage", onAuthChange);
        return () => {
            window.removeEventListener("auth:change", onAuthChange);
            window.removeEventListener("storage", onAuthChange);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <SiteNav
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                isLoggedIn={isLoggedIn}
                appPath={appPath}
            />

            <HeroSection isLoggedIn={isLoggedIn} appPath={appPath} />

            <ValueSection />

            <CtaSection isLoggedIn={isLoggedIn} appPath={appPath} />

            <SiteFooter />
        </div>
    );
}

function HeroSection({ isLoggedIn, appPath }) {
    return (
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-3xl bg-sky-100 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-100 blur-2xl" />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24 lg:gap-16 lg:px-8">
                <div>
                    <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                        Scheduling platform
                    </span>

                    <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                        Appointment
                        <br />
                        Scheduling <span className="whitespace-nowrap">for Free</span>
                    </h1>

                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                        Schedule bookings, improve your services, promote your business — all in one place.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        {isLoggedIn ? (
                            <Link
                                to={appPath}
                                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold text-slate-800 bg-slate-100 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            >
                                Open app
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                Get started for free
                            </Link>
                        )}
                    </div>

                    <SocialProof />
                </div>

                <HeroImages />
            </div>
        </section>
    );
}

function Star({ className = "h-4 w-4" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03L12 17.27z" />
        </svg>
    );
}
function SocialProof() {
    return (
        <div className="mt-8 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
                <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map(i => <Star key={i} className="h-4 w-4 text-amber-400" />)}
                </div>
                <span className="font-medium text-slate-700">4.9/5</span>
                <span className="text-slate-400">from 1,200+ reviews</span>
            </div>

            <span className="hidden text-slate-300 sm:inline">•</span>

            <div className="flex items-center gap-4">
                <span><span className="font-semibold text-slate-800">25k+</span> monthly bookings</span>
                <span className="hidden text-slate-300 sm:inline">•</span>
                <span><span className="font-semibold text-slate-800">5k+</span> teams onboarded</span>
            </div>
        </div>
    );
}

function HeroImages() {
    return (
        <div className="relative">
            <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute -left-6 -top-6 h-16 w-16 rotate-45 rounded-md bg-sky-200/70 blur-[2px]" />

                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                        <div className="ml-3 h-5 flex-1 rounded bg-white/70 text-xs text-slate-400 px-2 flex items-center">
                            reserv.app / dashboard
                        </div>
                    </div>

                    <img
                        src={heroDashboard}
                        alt="Calendar and booking dashboard"
                        loading="lazy"
                        className="h-auto w-full object-cover"
                    />
                </div>

                <div className="absolute -bottom-8 -left-6 w-40 sm:w-48 md:w-56 rotate-[-2deg]">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                        <img
                            src={heroAppointments}
                            alt="Appointments view"
                            loading="lazy"
                            className="h-auto w-full object-cover"
                        />
                    </div>
                </div>

                <div className="absolute -bottom-10 -right-6 w-40 sm:w-48 md:w-56">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                        <img
                            src={heroMobile}
                            alt="Mobile booking preview"
                            loading="lazy"
                            className="h-auto w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ValueSection() {
    return (
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
                        <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
        </div>
    );
}

function CtaSection({ isLoggedIn, appPath }) {
    return (
        <section className="relative">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 p-8 md:grid-cols-2 md:p-12">
                    <div>
                        <h3 className="text-2xl font-bold">Start accepting bookings today</h3>
                        <p className="mt-3 text-slate-600">
                            Create your booking page, add services, and share your link. It takes minutes.
                        </p>
                    </div>
                    <div className="flex justify-start md:justify-end">
                        {isLoggedIn ? (
                            <Link
                                to={appPath}
                                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-slate-800 bg-white shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            >
                                Open app
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                Create free account
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SiteNav({ mobileOpen, setMobileOpen, isLoggedIn, appPath }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.clear();
        window.dispatchEvent(new Event("auth:change"));
        navigate("/", { replace: true });
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                <Link to="/" className="flex items-center gap-3">
                    <img src={logoPng} alt="Company logo" className="h-8 w-auto" />
                    <span className="text-lg font-extrabold tracking-tight">Reserv</span>
                </Link>

                <div className="hidden items-center gap-3 md:flex">
                    {isLoggedIn ? (
                        <>
                            <Link
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                to={appPath}
                            >
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
                                    <Link className="w-full rounded-xl px-4 py-2 text-center font-semibold text-slate-700 hover:bg-slate-100" to={getAppPath(auth.getRole?.() || "")}>
                                        Open app
                                    </Link>
                                    <LogoutButton />
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

function LogoutButton() {
    const navigate = useNavigate();
    const onClick = () => {
        auth.clear();
        window.dispatchEvent(new Event("auth:change"));
        navigate("/", { replace: true });
    };
    return (
        <button
            onClick={onClick}
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-center font-semibold text-slate-700 hover:bg-slate-50"
        >
            Logout
        </button>
    );
}

function SiteFooter() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 lg:flex-row lg:px-8">
                <p>© {new Date().getFullYear()} Reserv, Inc. All rights reserved.</p>
            </div>
        </footer>
    );
}
