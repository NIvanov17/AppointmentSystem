import { X } from "lucide-react";

const AppointmentModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-700">
                    <X />
                </button>
                <h2 className="text-xl font-semibold mb-4 text-slate-800">New Appointment</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                        <input type="date" className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
                        <input type="time" className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Client Name</label>
                        <input type="text" placeholder="John Doe" className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
                        <textarea placeholder="Optional notes..." className="w-full border rounded px-3 py-2 text-sm" />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-sky-500 text-white rounded hover:bg-sky-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentModal;
