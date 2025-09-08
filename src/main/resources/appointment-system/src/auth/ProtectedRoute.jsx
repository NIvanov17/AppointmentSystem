import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "./token";

export default function ProtectedRoute() {
    const loc = useLocation();
    return auth.isLoggedIn()
        ? <Outlet />
        : <Navigate to="/login" replace state={{ from: loc }} />;
}
