import React from "react";
import { auth } from "../auth/token";
import AllAppointments from "./AllAppointments";
import AppointmentsProviders from "./AppointmentsProviders";

const AppointmentsPage = () => {
    const role = auth.getRole?.() || "";

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-1 overflow-auto">
                {role === "PROVIDER" ? (
                    <AppointmentsProviders />
                ) : (
                    <AllAppointments />
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;
