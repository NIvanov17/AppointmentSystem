import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoPng from "../assets/logo_ready.png";
import { auth } from "../auth/token";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [validationError, setValidationError] = useState("");
    const navigate = useNavigate();

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, password: form.password }),
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();

        const token = data.token || data.accessToken;
        if (!token) throw new Error("Missing token");

        auth.set(token, { email: data.email, role: data.role });

        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* top bar with logo -> home */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoPng} alt="Logo" className="h-7 w-auto" />
                        <span className="text-lg font-extrabold tracking-tight">Reserv</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Log in to your account
                        </h1>

                        {validationError && (
                            <div
                                role="alert"
                                className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
                            >
                                {validationError}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
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
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                LOG IN
                            </button>

                            <div className="text-center">
                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-semibold text-slate-600 hover:underline"
                                >
                                    FORGOT YOUR PASSWORD?
                                </Link>
                            </div>

                            <p className="mt-4 text-xs leading-relaxed text-slate-500">
                                By signing in or creating an account, you agree with{" "}
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
                                Don’t have an account?{" "}
                                <Link to="/register" className="text-sky-700 hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-slate-500 lg:px-8">
                    Copyright 2012–{new Date().getFullYear()} Reserv. All rights
                    reserved.
                </div>
            </footer>
        </div>
    );
}
