import React, { useState } from "react";

export default function AppointmentsTableViewButtonModal({ appointment }) {
  const [open, setOpen] = useState(false);

  // Dynamic status styling to match the table
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase().trim();
    
    if (statusLower === 'pending') {
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    }
    if (statusLower === 'completed') {
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    }
    if (statusLower === 'cancelled' || statusLower === 'canceled') {
      return 'bg-red-100 text-red-700 border border-red-200';
    }
    // Default fallback
    return 'bg-blue-100 text-blue-700 border border-blue-200';
  };

  return (
    <>
      {/* View Button - Underline on hover only */}
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm tracking-wide transition-all duration-200 hover:underline hover:underline-offset-4 hover:decoration-blue-400"
      >
        View
      </button>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-[560px] overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-7 py-6">
              <h2 className="text-2xl font-semibold tracking-tight">Appointment Details</h2>
            </div>

            {/* Content */}
            <div className="p-7 space-y-9">
              {/* Patient & Appointment Info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-7">
                <div>
                  <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">PATIENT</p>
                  <p className="text-lg font-semibold text-gray-900">{appointment.patient_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">DATE OF VISIT</p>
                  <p className="text-gray-800 font-medium">{appointment.date_of_visit}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">NEXT APPOINTMENT</p>
                  <p className="text-gray-800 font-medium">{appointment.next_appointment || "–"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">SERVICE</p>
                  <p className="text-gray-800 font-medium">
                    {appointment.fullService || appointment.service}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">STATUS</p>
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(appointment.visit_status)}`}>
                    {appointment.visit_status}
                  </span>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="border-t border-gray-100 pt-7">
                <div className="grid grid-cols-2 gap-x-8 gap-y-7">
                  <div>
                    <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">COMPLAINT</p>
                    <p className="text-gray-700 leading-relaxed">
                      {appointment.fullComplaint || appointment.complaint || "–"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">NOTE</p>
                    <p className="text-gray-700 italic">
                      {appointment.fullNote || appointment.note || "–"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t border-gray-100 pt-7 bg-gray-50 -mx-7 -mb-7 px-7 py-7 rounded-b-3xl">
                <p className="text-gray-500 text-xs font-medium tracking-widest mb-4">FINANCIAL SUMMARY</p>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">DEBIT</p>
                    <p className="text-xl font-semibold text-gray-900">{appointment.debit}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">CREDIT</p>
                    <p className="text-xl font-semibold text-amber-600">{appointment.credit}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium tracking-widest mb-1">BALANCE</p>
                    <p className="text-xl font-semibold text-emerald-600">{appointment.balance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-7 py-5 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="bg-blue-900 hover:bg-blue-950 text-white px-9 py-3 rounded-2xl text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.97]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}