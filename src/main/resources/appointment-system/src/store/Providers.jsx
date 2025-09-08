import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Topbar from "../components/Topbar";

const Providers = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 flex flex-col">
                <Topbar />

                <main className="flex-1 flex bg-slate-50 overflow-y-auto">
                    <Outlet />
                </main>


            </div>
        </div>
    );
};

export default Providers;
