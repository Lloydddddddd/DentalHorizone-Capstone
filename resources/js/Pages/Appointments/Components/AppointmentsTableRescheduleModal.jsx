import React, { useState } from "react";
import axios from "axios";

export default function AppointmentsTableRescheduleButton({ appointment }) {
  const [open, setOpen] = useState(false);
  const [newDate, setNewDate] = useState("");

  const handleReschedule = async () => {
    try {
      await axios.put(`/appointments/${appointment.id}/reschedule`, {
        date_of_visit: newDate,
        next_appointment: newDate,
      });
      alert("Appointment rescheduled successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to reschedule appointment.");
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
      >
        Reschedule
      </button>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Reschedule Appointment</h2>

            <label className="block mb-2">New Date & Time</label>
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleReschedule}
                className="bg-green-600 text-white px-3 py-1 rounded text-xs"
              >
                Save
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}