import { Menu, Calendar, Users, Settings, ClipboardList, Book, User, Home } from "lucide-react";
import NavItem from "./NavItem";
import { auth } from "../auth/token"

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    const role = auth.getRole() || "";
    const base = role === "PROVIDER" ? "/app/providers" : "/app/clients";
    const APPOINTMENTS_SEG = role === "PROVIDER" ? "appointment-providers" : "appointments";
    const email = auth.profile()?.email || "";
    const firstLetter = email ? email.charAt(0).toUpperCase() : "?";

    return (
        <aside
            className={`${sidebarOpen ? "w-64" : "w-20"
                } bg-white shadow-sm transition-all duration-300 ease-in-out flex flex-col py-6 shadow-md`}
        >
            <div className="flex items-center justify-center mb-10">
                <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-lg font-bold">
                    {firstLetter}
                </div>
            </div>

            <button
                onClick={toggleSidebar}
                className="mb-8 px-4 focus:outline-none text-gray-600"
            >
                <Menu />
            </button>

            <nav className="space-y-2 text-gray-700">
                <NavItem icon={<Calendar />} label="Appointments" path={`${base}/${APPOINTMENTS_SEG}`} sidebarOpen={sidebarOpen} />
                <NavItem icon={<Users />} label="Services" path={`${base}/services`} sidebarOpen={sidebarOpen} />
                <NavItem icon={<Home />} label="Home" path="/" sidebarOpen={sidebarOpen} />
            </nav>
        </aside>
    );
};

export default Sidebar;
