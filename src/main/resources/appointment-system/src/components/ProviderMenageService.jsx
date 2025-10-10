import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkingDaysSelector from "../components/WorkingDaysSelector";
import { ClipboardList } from "lucide-react";
import { auth } from "../auth/token";

const API_BASE = import.meta?.env?.VITE_API_BASE ?? "http://localhost:8080";
const API = {
    serviceTypes: () => `${API_BASE}/api/service-type`,
    getService: () => `${API_BASE}/api/provider/services`,
    UPDATE_PATH_BASE: `${API_BASE}/api/provider/services`,
    updateService: (id) => `${API_BASE}/api/provider/service/${id}`,
};

async function apiFetch(url, init = {}) {
    const token = auth?.get?.();
    const headers = {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(url, { ...init, headers });
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
            const data = await res.json();
            msg = data?.message || msg;
        } catch { }
        throw new Error(msg);
    }
    return res;
}

export default function UpdateService() {
    const navigate = useNavigate();

    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [resolvedId, setResolvedId] = useState("");

    const [form, setForm] = useState({
        serviceType: "",
        name: "",
        description: "",
        price: "",
        durationMinutes: "",
        workingDays: [],
    });

    const onChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const labelize = (s) =>
        s.replace(/_/g, " ").toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

    const typeOptions = useMemo(
        () => serviceTypes.map((t) => ({ value: t, label: labelize(t) })),
        [serviceTypes]
    );

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);

                const [typesRes, svcRes] = await Promise.all([
                    apiFetch(API.serviceTypes()),
                    apiFetch(API.getService()),
                ]);

                const [types, svc] = await Promise.all([typesRes.json(), svcRes.json()]);
                if (!alive) return;

                setServiceTypes(Array.isArray(types) ? types : []);

                const dto = Array.isArray(svc) ? svc[0] : svc;

                if (!dto) {
                    setError("No service found for this provider.");
                    return;
                }

                if (dto.id == null) {
                    setError("Service id is missing in the GET response.");
                    return;
                }

                setResolvedId(String(dto.id));

                setForm({
                    serviceType: dto?.serviceType ?? "",
                    name: dto?.name ?? "",
                    description: dto?.description ?? "",
                    price: dto?.price != null ? String(dto.price) : "",
                    durationMinutes:
                        dto?.durationMinutes != null ? String(dto.durationMinutes) : "",
                    workingDays: Array.isArray(dto?.workingDays) ? dto.workingDays : [],
                });
            } catch (err) {
                setError(err?.message || "Failed to load service");
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!resolvedId) {
            setError("Missing service id for update.");
            return;
        }

        const priceNum = Number(form.price);
        const durNum = Number(form.durationMinutes);
        if (!form.serviceType) return setError("Please choose a service type.");
        if (!form.name?.trim()) return setError("Please enter a name.");
        if (!Number.isFinite(priceNum) || priceNum <= 0)
            return setError("Price must be a positive number.");
        if (!Number.isInteger(durNum) || durNum <= 0)
            return setError("Duration must be a positive integer.");

        const dto = {
            serviceType: form.serviceType,
            name: form.name.trim(),
            description: form.description.trim(),
            price: priceNum,
            durationMinutes: durNum,
            workingDays: form.workingDays,
        };

        try {
            setSaving(true);
            const url = API.updateService(resolvedId);
            console.log("PUT", url, dto);
            await apiFetch(url, {
                method: "PUT",
                body: JSON.stringify(dto),
            });
            alert("Service updated!");
            navigate(-1);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-6 py-10">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
                    <div className="xl:col-span-6">
                        <div className="relative z-20 h-full rounded-2xl border border-slate-200 bg-white shadow-sm p-6 lg:p-10">
                            <div className="mb-8">
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                    Update Service
                                </h1>
                                <p className="mt-2 text-slate-600">
                                    Refactor price, name, description, duration, and working days.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-slate-600">Loading…</div>
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-8 w-full">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                                        <div className="lg:col-span-6">
                                            <label className="block text-sm font-medium text-slate-700">
                                                Service Type
                                            </label>
                                            <select
                                                name="serviceType"
                                                value={form.serviceType}
                                                onChange={onChange}
                                                className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                            >
                                                <option value="">Select type</option>
                                                {typeOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="lg:col-span-6">
                                            <label className="block text-sm font-medium text-slate-700">
                                                Service Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={onChange}
                                                className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                            />
                                        </div>

                                        <div className="lg:col-span-12">
                                            <label className="block text-sm font-medium text-slate-700">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                rows={5}
                                                value={form.description}
                                                onChange={onChange}
                                                className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                            />
                                        </div>

                                        <div className="lg:col-span-6">
                                            <label className="block text-sm font-medium text-slate-700">
                                                Price
                                            </label>
                                            <div className="relative mt-2">
                                                <input
                                                    type="number"
                                                    name="price"
                                                    step="0.01"
                                                    value={form.price}
                                                    onChange={onChange}
                                                    className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-base shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                                />
                                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                                                    €
                                                </span>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-6">
                                            <label className="block text-sm font-medium text-slate-700">
                                                Duration (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                name="durationMinutes"
                                                value={form.durationMinutes}
                                                onChange={onChange}
                                                className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                            />
                                        </div>
                                    </div>

                                    <WorkingDaysSelector
                                        value={form.workingDays}
                                        onChange={(days) => setForm((f) => ({ ...f, workingDays: days }))}
                                    />

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
                                        >
                                            {saving ? "Saving…" : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <aside className="xl:col-span-6">
                        <div className="h-full rounded-2xl overflow-hidden">
                            <div className="relative flex h-full min-h-[540px] items-center">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-600 via-cyan-600 to-blue-700" />
                                <div className="pointer-events-none absolute -top-20 -left-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                                <svg className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
                                    <defs>
                                        <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
                                            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#dots)" />
                                </svg>

                                <div className="relative z-10 w-full px-10 py-12 text-white pointer-events-auto">
                                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                                        <ClipboardList className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-3xl font-black leading-tight">Polish your service</h2>
                                    <p className="mt-2 text-white/90">
                                        Keep details fresh—clear names, crisp descriptions, fair pricing, and
                                        accurate working days bring more bookings.
                                    </p>
                                    <ul className="mt-6 space-y-3 text-sm">
                                        <li className="flex items-start gap-3">
                                            <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                                            Add what’s included and prep notes.
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                                            Keep duration realistic to reduce gaps.
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                                            Update working days as your schedule changes.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
