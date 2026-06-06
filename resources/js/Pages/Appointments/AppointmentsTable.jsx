import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import AppointmentsTableViewButtonModal from "@/Pages/Appointments/Components/AppointmentsTableViewModal";
import AppointmentsTableRescheduleButton from "@/Pages/Appointments/Components/AppointmentsTableRescheduleModal";
import AddAppointmentPopup from "@/Components/AddAppointmentPopup";

export default function AppointmentsTable({ appointments, highlightId }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const rowRefs = useRef({});

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedAppointment(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (highlightId && rowRefs.current[highlightId]) {
      rowRefs.current[highlightId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightId]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.put(`/appointments/${id}/cancel`);
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-orange-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Date of Visit</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Next Appointment</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Name</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Complaint</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Service</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Visit Status</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Debit</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Credit</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Balance</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Note</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-blue-900 border-b-2 border-orange-300">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {appointments.length === 0 && (
            <tr>
              <td colSpan={11} className="px-6 py-6 text-center text-sm text-gray-500">
                No appointments found.
              </td>
            </tr>
          )}

          {appointments.map((appointment) => (
            <tr
              key={appointment.id}
              ref={(el) => (rowRefs.current[appointment.id] = el)}
              className={`last:border-0 ${
                highlightId == appointment.id
                  ? "bg-yellow-100 ring-2 ring-yellow-400"
                  : "hover:bg-gray-50 transition"
              }`}
            >
              <td className="px-4 py-3 text-sm">{appointment.date_of_visit}</td>
              <td className="px-4 py-3 text-sm">{appointment.next_appointment || "–"}</td>
              <td className="px-4 py-3 text-sm font-medium">{appointment.patient_name}</td>
              <td className="px-4 py-3 text-sm" title={appointment.fullComplaint}>{appointment.complaint}</td>
              <td className="px-4 py-3 text-sm" title={appointment.fullService}>{appointment.service}</td>
              <td className="px-4 py-3 text-sm capitalize">
                {appointment.visit_status === "pending" && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                )}
                {appointment.visit_status === "completed" && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Completed
                  </span>
                )}
                {appointment.visit_status === "cancelled" && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    Cancelled
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm">{appointment.debit}</td>
              <td className="px-4 py-3 text-sm">{appointment.credit}</td>
              <td className="px-4 py-3 text-sm">{appointment.balance}</td>
              <td className="px-4 py-3 text-sm" title={appointment.fullNote}>{appointment.note || "–"}</td>
              <td className="px-4 py-3 text-sm space-x-2">
                <AppointmentsTableViewButtonModal appointment={appointment} />
                <AppointmentsTableRescheduleButton appointment={appointment} />
                {appointment.visit_status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="text-red-600 hover:text-red-800 hover:underline"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() =>
                    setSelectedAppointment({
                      mode: "edit",
                      data: {
                        ...appointment,
                        complaint: appointment.fullComplaint,
                        service: appointment.fullService,
                        note: appointment.fullNote,
                        services: appointment.raw_services,
                        date_of_visit: appointment.raw_date_of_visit || "",
                        next_appointment: appointment.raw_next_appointment,
                      },
                    })
                  }
                  className="text-green-600 hover:text-green-800 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAppointment?.mode === "edit" && (
        <AddAppointmentPopup
          appointment={selectedAppointment.data}
          mode="edit"
          onClose={() => setSelectedAppointment(null)}
          onSaved={() => router.visit(route("appointments.index"))}
        />
      )}
    </div>
  );
}