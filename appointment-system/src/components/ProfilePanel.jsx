import { X, Crown, LogOut, HelpCircle } from "lucide-react";
import { auth } from "../auth/token";
import { useNavigate } from "react-router-dom";

const ProfilePanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
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

            <div className="px-6 py-4 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-4xl text-slate-500">👤</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-800">Nikolay Ivanov</h3>
                <p className="text-sm text-slate-500">testExample@abv.bg</p>
                <p className="text-xs text-slate-400">Europe/Sofia</p>
                <a href="#" className="text-sky-600 text-sm hover:underline mt-1 inline-block">
                    View Org Details
                </a>
            </div>

            <div className="border-t">
                <div className="px-6 py-4">
                    <button className="w-full text-left text-slate-700 text-sm font-medium mb-3">My Account</button>
                    <button onClick={handleLogout} className="w-full text-left text-red-500 text-sm font-medium flex items-center gap-2">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>

                <div className="border-t px-6 py-4">
                    <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Subscription</h4>
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>Premium Trial</span>
                        <Crown className="text-yellow-500" size={16} />
                    </div>
                    <div className="text-xs text-slate-400">Trainers - 1/10</div>
                    <div className="text-xs text-slate-400">Workspaces - 1/3</div>
                    <div className="text-xs text-slate-400">Resources - 0/10</div>
                </div>

                <div className="border-t px-6 py-4">
                    <h4 className="text-xs uppercase text-slate-400 font-semibold mb-2">Need Help?</h4>
                    <div className="text-sm text-sky-600 flex items-center gap-2 hover:underline cursor-pointer">
                        <HelpCircle size={16} /> Help Center
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePanel;
