import { Plus, Calendar, Bell, Settings, UserCircle } from "lucide-react";
import { useState } from "react";
import ProfilePanel from "./ProfilePanel";


const Topbar = () => {
    const [panelOpen, setPanelOpen] = useState(false);

    return (
        <header className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-slate-800">Appointments</h1>

            <div className="flex items-center gap-4 text-sm text-slate-600">

                <button className="w-8 h-8 bg-sky-500 text-white rounded flex items-center justify-center hover:bg-sky-600 transition">
                    <Plus size={18} />
                </button>

                <button className="hover:text-sky-600 transition">
                    <Calendar size={20} />
                </button>
                <button className="hover:text-sky-600 transition">
                    <Bell size={20} />
                </button>
                <button className="hover:text-sky-600 transition">
                    <Settings size={20} />
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
