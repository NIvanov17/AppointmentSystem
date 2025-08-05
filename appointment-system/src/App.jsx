import Index from "./store/Indexx";
import "./app.css"
import { Routes, Route, Navigate } from 'react-router-dom';
import AppointmentsPage from './components/AppointmentsPage';

const Placeholder = ({ title }) => (
    <div className="p-6 text-slate-500 text-center">
        This is the <strong>{title}</strong> page.
    </div>
);

const app = () => {
    // const { isAuthenticated } = useAuth();
    return (
        <>
            <Index>
                <Routes>
                    <Route path="/" element={<Navigate to="/appointments" />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/workout-sessions" element={<Placeholder title="Workout Sessions" />} />
                    <Route path="/workflows" element={<Placeholder title="Workflows" />} />
                    <Route path="/booking-pages" element={<Placeholder title="Booking Pages" />} />
                    <Route path="/trainers" element={<Placeholder title="Trainers" />} />
                    <Route path="/settings" element={<Placeholder title="Settings" />} />
                </Routes>
            </Index >
        </>
    );
}

export default app;
