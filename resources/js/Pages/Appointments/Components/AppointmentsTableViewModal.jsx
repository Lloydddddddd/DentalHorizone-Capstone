import React, { useState } from "react";

export default function AppointmentsTableViewButtonModal({ appointment }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
      >
        View
      </button>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-[600px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Appointment Details</h2>
            <p><strong>Patient:</strong> {appointment.patient_name}</p>
            <p><strong>Date of Visit:</strong> {appointment.date_of_visit}</p>
            <p><strong>Next Appointment:</strong> {appointment.next_appointment || "–"}</p>
            <p><strong>Status:</strong> {appointment.visit_status}</p>
            <p><strong>Complaint:</strong> {appointment.fullComplaint || appointment.complaint}</p>
            <p><strong>Service:</strong> {appointment.fullService || appointment.service}</p>
            <p><strong>Note:</strong> {appointment.fullNote || appointment.note || "–"}</p>
            <p><strong>Balance:</strong> {appointment.balance}</p>
            <p><strong>Debit:</strong> {appointment.debit}</p>
            <p><strong>Credit:</strong> {appointment.credit}</p>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 bg-gray-500 text-white px-3 py-1 rounded text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}