import { Calendar, UserCircle } from "lucide-react";
import { useState } from "react";
import ProfilePanel from "./ProfilePanel";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/token";


const Topbar = () => {
    const [panelOpen, setPanelOpen] = useState(false);
    const navigate = useNavigate();
    const role = auth.getRole?.() || "";

    const handleClick = () => {
        if (role === "PROVIDER") {
            navigate("/app/providers/appointment-providers");
        } else if (role === "CLIENT") {
            navigate("/app/clients/appointments");
        } else {
            // fallback if no role or not authenticated
            navigate("/login");
        }
    };

    return (
        <header className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-slate-800">Appointments</h1>

            <div className="flex items-center gap-4 text-sm text-slate-600">

                <button
                    onClick={handleClick}
                    className="hover:text-sky-600 transition"
                    title="Appointments"
                >
                    <Calendar size={20} />
                </button>

                <div
                    onClick={() => setPanelOpen(true)}
                    className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                    <UserCircle size={20} />
                </div>

                <ProfilePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />

            </div>
        </header>
    );
};

export default Topbar;
