import { Menu, Calendar, Users, Settings, ClipboardList, Book, User } from "lucide-react";
import NavItem from "./NavItem";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    return (
        <aside
            className={`${sidebarOpen ? "w-64" : "w-20"
                } bg-white shadow-sm transition-all duration-300 ease-in-out flex flex-col py-6 shadow-md`}
        >
            <div className="flex items-center justify-center mb-10">
                <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-lg font-bold">
                    TE
                </div>
            </div>

            <button
                onClick={toggleSidebar}
                className="mb-8 px-4 focus:outline-none text-gray-600"
            >
                <Menu />
            </button>

            <nav className="space-y-2 text-gray-700">
                <NavItem icon={<Calendar />} label="Appointments" path="/app/appointments" sidebarOpen={sidebarOpen} />
                <NavItem icon={<Users />} label="Workout Sessions" path="/app/workout-sessions" sidebarOpen={sidebarOpen} />
                <NavItem icon={<ClipboardList />} label="Workflows" path="/app/workflows" sidebarOpen={sidebarOpen} />
                <NavItem icon={<Book />} label="Booking Pages" path="/app/booking-pages" sidebarOpen={sidebarOpen} />
                <NavItem icon={<User />} label="Trainers" path="/app/trainers" sidebarOpen={sidebarOpen} />
                <NavItem icon={<Settings />} label="Settings" path="/app/settings" sidebarOpen={sidebarOpen} />
            </nav>
        </aside>
    );
};

export default Sidebar;
