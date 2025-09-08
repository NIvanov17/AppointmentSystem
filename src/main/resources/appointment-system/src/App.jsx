import Providers from "./store/Providers";
import "./app.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AppointmentsPage from "./components/AppointmentsPage";
import LandingPage from "./routes/LandingPage";
import SignUpRoleSelect from "./components/SignUpRoleSelect";
import Login from "./routes/Login";
import SignUpUser from "./routes/SignUpUser";
import SignUpProvider from "./routes/SignUpProvider";
import ProtectedRoute from "./auth/ProtectedRoute";

const Placeholder = ({ title }) => (
    <div className="p-6 text-slate-500 text-center">
        This is the <strong>{title}</strong> page.
    </div>
);

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUpRoleSelect />} />
            <Route path="/signup/user" element={<SignUpUser />} />
            <Route path="/signup/provider" element={<SignUpProvider />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<Providers />}>
                    <Route index element={<Navigate to="appointments" replace />} />
                    <Route path="appointments" element={<AppointmentsPage />} />
                    <Route path="workout-sessions" element={<Placeholder title="Workout Sessions" />} />
                    <Route path="workflows" element={<Placeholder title="Workflows" />} />
                    <Route path="booking-pages" element={<Placeholder title="Booking Pages" />} />
                    <Route path="trainers" element={<Placeholder title="Trainers" />} />
                    <Route path="settings" element={<Placeholder title="Settings" />} />
                </Route>
            </Route>

            {/* catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
