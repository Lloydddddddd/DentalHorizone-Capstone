import React, { useState } from "react";

export default function AppointmentsTableViewButtonModal({ appointment }) {
  const [open, setOpen] = useState(false);

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
    return 'bg-blue-100 text-blue-700 border border-blue-200';
  };

  return (
    <>
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
            className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-blue-900 text-white px-6 py-4">
              <h2 className="text-lg font-semibold tracking-tight">Appointment Details</h2>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6">
              {/* Patient & Appointment Info */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-5 text-sm">
                <div>
                  <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">PATIENT</p>
                  <p className="font-semibold text-gray-900">{appointment.patient_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">DATE OF VISIT</p>
                  <p className="text-gray-800 font-medium">{appointment.date_of_visit || "—"}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">NEXT APPOINTMENT</p>
                  <p className="text-gray-800 font-medium">{appointment.next_appointment || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">SERVICE</p>
                  <p className="text-gray-800 font-medium">
                    {appointment.fullService || appointment.service}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">STATUS</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(appointment.visit_status)}`}>
                    {appointment.visit_status}
                  </span>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="border-t border-gray-100 pt-5">
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">COMPLAINT</p>
                    <p className="text-gray-700 leading-relaxed">
                      {appointment.fullComplaint || appointment.complaint || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">NOTE</p>
                    <p className="text-gray-700 italic">
                      {appointment.fullNote || appointment.note || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t border-gray-100 pt-5 bg-gray-50 -mx-5 -mb-5 px-5 py-5 rounded-b-2xl">
                <p className="text-gray-500 text-xs font-medium tracking-widest mb-3">FINANCIAL SUMMARY</p>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">DEBIT</p>
                    <p className="text-base font-semibold text-gray-900">{appointment.debit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">CREDIT</p>
                    <p className="text-base font-semibold text-amber-600">{appointment.credit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium tracking-widest mb-0.5">BALANCE</p>
                    <p className="text-base font-semibold text-emerald-600">{appointment.balance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="bg-blue-900 hover:bg-blue-950 text-white px-7 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
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