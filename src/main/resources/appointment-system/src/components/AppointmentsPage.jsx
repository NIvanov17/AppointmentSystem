import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import AppointmentModal from "./AppointmentModal";

const AppointmentsPage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="flex flex-col items-center text-center">
                <div className="text-6xl mb-6">📅</div>
                <h2 className="text-xl font-semibold text-slate-800 mb-1">No upcoming appointments</h2>
                <p className="text-slate-500 mb-6">Organize your schedule by adding appointments here.</p>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <CalendarPlus size={18} /> New Appointment
                </button>
            </div>
            <AppointmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default AppointmentsPage;
