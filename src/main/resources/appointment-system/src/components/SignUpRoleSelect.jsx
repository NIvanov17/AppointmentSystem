import { useNavigate } from "react-router-dom";
import { CalendarDays, Building2, ArrowLeft } from "lucide-react";

export default function SignUpRoleSelect() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-3xl">
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 text-center mb-8">
                    How do you want to use the platform?
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => navigate("/signup/user")}
                        className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all text-left focus:outline-none focus:ring-4 focus:ring-sky-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-slate-100">
                                <CalendarDays className="w-7 h-7" aria-hidden="true" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    I want to book appointments
                                </h2>
                                <p className="text-slate-500">
                                    Discover services and manage your bookings with ease.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <span className="inline-flex items-center gap-2 text-sky-700 group-hover:translate-x-0.5 transition-transform">
                                Continue
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293A1 1 0 1111.707 4.293l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate("/signup/provider")}
                        className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all text-left focus:outline-none focus:ring-4 focus:ring-sky-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-slate-100">
                                <Building2 className="w-7 h-7" aria-hidden="true" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    I provide services
                                </h2>
                                <p className="text-slate-500">
                                    List your services, set availability, and accept bookings.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <span className="inline-flex items-center gap-2 text-sky-700 group-hover:translate-x-0.5 transition-transform">
                                Continue
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293A1 1 0 1111.707 4.293l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </div>
                    </button>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-sky-700 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
