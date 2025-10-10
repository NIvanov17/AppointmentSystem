import Providers from "./store/Providers";
import "./app.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AppointmentsPage from "./components/AppointmentsPage";
import AppointmentsProviders from "./components/AppointmentsProviders";
import LandingPage from "./routes/LandingPage";
import SignUpRoleSelect from "./components/SignUpRoleSelect";
import Login from "./routes/Login";
import SignUpUser from "./routes/SignUpUser";
import SignUpProvider from "./routes/SignUpProvider";
import RegisterService from "./routes/RegisterService";
import ProtectedRoute from "./auth/ProtectedRoute";
import BookService from "./components/Bookservice";
import ProviderMenageService from "./components/ProviderMenageService";

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
            <Route path="/register/service" element={<RegisterService />} />


            <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
                <Route path="/app/providers" element={<Providers />}>
                    <Route index element={<Navigate to="appointment-providers" replace />} />
                    <Route path="appointment-providers" element={<AppointmentsProviders />} />
                    <Route path="services" element={<ProviderMenageService />} />
                    <Route path="home" element={<Placeholder title="Home" />} />
                    <Route path="booking-pages" element={<Placeholder title="Booking Pages" />} />
                    <Route path="trainers" element={<Placeholder title="Trainers" />} />
                    <Route path="settings" element={<Placeholder title="Settings" />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["CLIENT"]} />}>
                <Route path="/app/clients" element={<Providers />}>
                    <Route index element={<Navigate to="appointments" replace />} />
                    <Route path="appointments" element={<AppointmentsPage />} />
                    <Route path="services" element={<BookService />} />
                    <Route path="home" element={<Placeholder title="Home" />} />
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
