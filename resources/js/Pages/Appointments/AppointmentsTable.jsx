export default function AppointmentsTable({ appointments }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date of Visit</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Next Appointment</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Complaint</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Service</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Visit Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Balance</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Debit</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Credit</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Note</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {appointments.length === 0 && (
            <tr>
              <td
                colSpan={10}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No appointments found.
              </td>
            </tr>
          )}

          {appointments.map((appt, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-sm">{appt.date_of_visit}</td>
              <td className="px-4 py-3 text-sm">{appt.next_appointment || "–"}</td>
              <td className="px-4 py-3 text-sm font-medium">{appt.patient_name}</td>
              <td className="px-4 py-3 text-sm" title={appt.fullComplaint}>{appt.complaint}</td>
              <td className="px-4 py-3 text-sm" title={appt.fullService}>{appt.service}</td>
              <td className="px-4 py-3 text-sm capitalize">
                {appt.visit_status === "completed" ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Completed
                  </span>
                ) : appt.visit_status === "pending" ? (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                    {appt.visit_status}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm">{appt.balance}</td>
              <td className="px-4 py-3 text-sm">{appt.debit}</td>
              <td className="px-4 py-3 text-sm">{appt.credit}</td>
              <td className="px-4 py-3 text-sm" title={appt.fullNote}>{appt.note || "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
