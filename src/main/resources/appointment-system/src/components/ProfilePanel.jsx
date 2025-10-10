import { useEffect, useMemo, useState } from "react";
import { X, LogOut, HelpCircle } from "lucide-react";
import { auth } from "../auth/token";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE ?? "http://localhost:8080";

function initialsOf(firstName = "", lastName = "") {
    const a = (firstName?.trim()?.[0] ?? "").toUpperCase();
    const b = (lastName?.trim()?.[0] ?? "").toUpperCase();
    return (a + b) || "👤";
}

const ProfilePanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const role = auth.getRole?.() || "";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            try {
                const token = auth.get?.();
                const res = await fetch(`${API_BASE}/api/user/profile`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                if (res.ok) setProfile(await res.json());
                else console.error("[ProfilePanel] Failed to load profile");
            } catch (e) {
                console.error("[ProfilePanel] Error:", e);
            }
        })();
    }, [isOpen]);

    const fullName = useMemo(() => {
        if (!profile) return "";
        const { firstName, lastName } = profile;
        return [firstName, lastName].filter(Boolean).join(" ");
    }, [profile]);

    const handleLogout = () => {
        auth.clear();
        window.dispatchEvent(new Event("auth:change"));
        navigate("/", { replace: true });
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="flex justify-between items-center px-4 py-3 border-b">
                <h2 className="font-semibold text-slate-800">Profile</h2>
                <button onClick={onClose}>
                    <X />
                </button>
            </div>

            <div className="px-6 py-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold">
                    {initialsOf(profile?.firstName, profile?.lastName)}
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    {fullName || "Loading..."}
                </h3>
                <p className="text-sm text-slate-500">{profile?.email ?? ""}</p>

                <div className="mt-3 flex items-center justify-center gap-2">
                    {role && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                            {role}
                        </span>
                    )}
                    <span className="text-xs text-slate-400">{timeZone}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                    {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </div>
            </div>

            <div className="border-t">
                <div className="px-6 py-4">
                    <Link
                        to="/app/clients/settings"
                        className="block w-full text-left text-slate-700 text-sm font-medium mb-3 hover:text-sky-600"
                    >
                        Account Settings
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full text-left text-red-500 text-sm font-medium flex items-center gap-2"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>

                <div className="border-t px-6 py-4">
                    <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Need Help?</h4>
                    <Link
                        to="/help"
                        className="text-sm text-sky-600 flex items-center gap-2 hover:underline"
                    >
                        <HelpCircle size={16} /> Help Center
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfilePanel;
