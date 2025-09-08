import { useState } from "react";
import { Link } from "react-router-dom";
import logoPng from "../assets/logo_ready.png";

export default function Register() {
    const [form, setForm] = useState({ company: "", fullName: "", email: "", password: "" });

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const onSubmit = (e) => {
        e.preventDefault();
        // TODO: call your API (e.g., POST /api/auth/register)
        console.log("register payload:", form);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* top bar */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logoPng} alt="Logo" className="h-7 w-auto" />
                            <span className="text-lg font-extrabold tracking-tight">Reserv</span>
                        </Link>
                    </div>
                    <div className="text-sm">
                        <Link
                            to="/login"
                            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </header>

            {/* content */}
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* left: form card */}
                    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h1 className="text-2xl font-bold tracking-tight">Create business account</h1>

                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="company" className="mb-1 block text-sm font-medium text-slate-700">
                                    Company name
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    value={form.company}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                                    placeholder="Acme Fitness"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
                                    Full name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={form.fullName}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                    placeholder="Jane Doe"
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

                            {/* or continue with
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3 text-xs text-slate-500">or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <SocialBtn brand="Google" />
                                <SocialBtn brand="Apple" />
                                <SocialBtn brand="Facebook" />
                            </div> */}

                            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                                By signing in or creating an account, you agree with our{" "}
                                <a href="#" className="text-sky-700 hover:underline">
                                    Terms & Conditions
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-sky-700 hover:underline">
                                    Privacy Policy
                                </a>
                                .
                            </p>

                            <p className="mt-6 text-center text-sm text-slate-600">
                                Already have a business account?{" "}
                                <Link to="/login" className="text-sky-700 hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </form>
                    </div>

                    {/* right: benefits + testimonial */}
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
