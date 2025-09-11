import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "./token";

export default function ProtectedRoute({ allowedRoles }) {
    const loc = useLocation();
    const isLoggedIn = auth.isLoggedIn();
    const role = auth.getRole();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: loc }} />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
