import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import WorkingDaysSelector from "../components/WorkingDaysSelector";

import logoPng from "../assets/logo_ready.png";

export default function RegisterService() {
    const location = useLocation();
    const navigate = useNavigate();

    // Provider email passed from previous step
    const providerEmail = location.state?.email || "";

    const [serviceTypes, setServiceTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        serviceType: "",
        name: "",
        description: "",
        price: "",
        durationMinutes: "",
        workingDays: []
    });

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Optional: pretty labels for enum names
    const labelize = (s) =>
        s.replace(/_/g, " ").toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

    const typeOptions = useMemo(
        () => serviceTypes.map((t) => ({ value: t, label: labelize(t) })),
        [serviceTypes]
    );

    useEffect(() => {
        let isMounted = true;
        setLoadingTypes(true);
        fetch("http://localhost:8080/api/service-type")
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load service types (${res.status})`);
                return res.json();
            })
            .then((data) => {
                if (isMounted) {
                    setServiceTypes(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => setError(err?.message || "Could not load service types"))
            .finally(() => isMounted && setLoadingTypes(false));
        return () => (isMounted = false);
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // basic client-side validation
        const priceNum = Number(form.price);
        const durNum = Number(form.durationMinutes);
        if (!providerEmail) {
            setError("Missing provider email. Please start from account registration.");
            return;
        }
        if (!form.serviceType) {
            setError("Please choose a service type.");
            return;
        }
        if (!form.name?.trim()) {
            setError("Please enter a service name.");
            return;
        }
        if (!form.description?.trim()) {
            setError("Please enter a description.");
            return;
        }
        if (!Number.isFinite(priceNum) || priceNum <= 0) {
            setError("Price must be a positive number.");
            return;
        }
        if (!Number.isInteger(durNum) || durNum <= 0) {
            setError("Duration must be a positive integer (minutes).");
            return;
        }

        const dto = {
            serviceType: form.serviceType,      // must match your enum string
            name: form.name.trim(),
            description: form.description.trim(),
            price: priceNum,
            durationMinutes: durNum,
            providerEmail,
            workingDays: form.workingDays,
        };

        setSubmitting(true);
        fetch("http://localhost:8080/api/register/service", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().catch(() => ({})).then((errData) => {
                        throw new Error(errData.message || `Service registration failed (${res.message})`);
                    });
                }
                return res.text();
            })
            .then((msg) => {
                alert(msg || "Service registered!");
                navigate("/login");
            })
            .catch((err) => setError(err?.message || "Something went wrong"))
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Top bar */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoPng} alt="Logo" className="h-7 w-auto" />
                        <span className="text-lg font-extrabold tracking-tight">Reserv</span>
                    </Link>
                </div>
            </header>

            {/* Stepper */}
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <ol className="flex items-center gap-4 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white text-xs font-bold">1</span>
                        Account
                    </li>
                    <svg width="20" height="20" viewBox="0 0 20 20"><path d="M7 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
                    <li className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-bold ring-1 ring-sky-300">2</span>
                        Service
                    </li>
                </ol>
            </div>

            {/* Card */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Register Your Service</h1>
                            <p className="mt-1 text-sm text-slate-600">Describe what you offer. You can add more services later.</p>
                        </div>
                        <span className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                            Provider: {providerEmail || "N/A"}
                        </span>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="mt-6 space-y-6">
                        {/* Grid */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <label htmlFor="serviceType" className="mb-1 block text-sm font-medium text-slate-700">
                                    Service Type
                                </label>
                                <select
                                    id="serviceType"
                                    name="serviceType"
                                    value={form.serviceType}
                                    onChange={onChange}
                                    disabled={loadingTypes}
                                    required
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                                >
                                    {loadingTypes ? (
                                        <option>Loading types…</option>
                                    ) : (
                                        <>
                                            <option value="">Select type</option>
                                            {typeOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="sm:col-span-1">
                                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                                    Service Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={onChange}
                                    placeholder="e.g., Men's Haircut"
                                    required
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={onChange}
                                    placeholder="Briefly describe the service, what’s included, preparation, etc."
                                    required
                                    rows={4}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                />
                            </div>

                            <div className="sm:col-span-1">
                                <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">
                                    Price
                                </label>
                                <div className="relative">
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        inputMode="decimal"
                                        value={form.price}
                                        onChange={onChange}
                                        placeholder="e.g., 25.00"
                                        required
                                        className="block w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">€</span>
                                </div>
                            </div>

                            <div className="sm:col-span-1">
                                <label htmlFor="durationMinutes" className="mb-1 block text-sm font-medium text-slate-700">
                                    Duration (minutes)
                                </label>
                                <input
                                    id="durationMinutes"
                                    name="durationMinutes"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={form.durationMinutes}
                                    onChange={onChange}
                                    placeholder="e.g., 45"
                                    required
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                />
                            </div>
                        </div>
                        <WorkingDaysSelector
                            value={form.workingDays}
                            onChange={(days) => setForm({ ...form, workingDays: days })}
                        />

                        <div className="flex items-center justify-between pt-2">


                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-60"
                            >
                                {submitting ? "Registering…" : "Register Service"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
