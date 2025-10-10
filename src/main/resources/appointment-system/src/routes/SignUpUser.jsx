import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoPng from "../assets/logo_ready.png";

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        setError(null);

        const registerDTO = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            password: form.password,
        };

        fetch("http://localhost:8080/api/register/client", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registerDTO),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((errData) => {
                        throw new Error(errData.message || `Registration failed (${res.status})`);
                    });
                }
                return res.text();
            })
            .then((msg) => {
                alert(msg || "Registered!");
                navigate("/login");
            })
            .catch((err) => setError(err?.message || "Something went wrong"));
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoPng} alt="Logo" className="h-7 w-auto" />
                        <span className="text-lg font-extrabold tracking-tight">Reserv</span>
                    </Link>
                    <Link
                        to="/login"
                        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                    >
                        Log in
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h1 className="text-2xl font-bold tracking-tight">Create business account</h1>
                        {error && (
                            <div
                                role="alert"
                                className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-slate-700">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={form.firstName}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    placeholder="Jane"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-slate-700">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={form.lastName}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    placeholder="Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-slate-700">
                                    Phone Number
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={form.phoneNumber}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    placeholder="+359888123456"
                                    pattern="^\+?[0-9]{7,15}$"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-2 w-full rounded-lg bg-sky-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                CREATE ACCOUNT
                            </button>

                            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                                By signing in or creating an account, you agree with our{" "}
                                <a href="#" className="text-sky-700 hover:underline">Terms & Conditions</a> and{" "}
                                <a href="#" className="text-sky-700 hover:underline">Privacy Policy</a>.
                            </p>

                            <p className="mt-6 text-center text-sm text-slate-600">
                                Already have a business account?{" "}
                                <Link to="/login" className="text-sky-700 hover:underline">Log in</Link>
                            </p>
                        </form>
                    </div>

                    <aside className="mx-auto w-full max-w-xl lg:mx-0">
                        <h2 className="text-2xl font-bold tracking-tight">Start your free 14-day trial now</h2>
                        <p className="mt-1 text-slate-600">No fees. No credit card required.</p>

                        <ul className="mt-6 space-y-3 text-slate-700">
                            {[
                                "Access all Premium features",
                                "Join the 300,000+ businesses worldwide",
                                "Set up the app in 5 mins",
                                "GDPR compliant and ISO 27001",
                            ].map((t) => (
                                <li key={t} className="flex items-start gap-3">
                                    <CheckIcon className="mt-0.5 h-5 w-5 text-sky-600" />
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-700">
                                Reserv is awesome! It saves us tons of time because our clients now book and manage their appointments
                                online. We’ve built an amazing client database and now can manage memberships effortlessly.
                            </p>
                            <p className="mt-4 text-sm font-semibold text-slate-900">Zuzana Soukupová</p>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}
