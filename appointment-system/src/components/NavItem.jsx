import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ icon, label, path, sidebarOpen }) => {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Link
            to={path}
            className={`flex items-center space-x-4 px-6 py-2 rounded transition-all cursor-pointer
        ${isActive ? 'bg-sky-100 text-sky-600 font-medium' : 'hover:bg-sky-100 text-slate-700'}`}
        >
            <div className="text-sky-600">{icon}</div>
            {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
        </Link>
    );
};

export default NavItem;
