import AllAppointments from "./AllAppointments";

const AppointmentsPage = () => {
    return (
        <div className="h-full w-full flex flex-col">
            {/* All Appointments list */}
            <div className="flex-1 overflow-auto">
                <AllAppointments />
            </div>
        </div>
    );
};

export default AppointmentsPage;