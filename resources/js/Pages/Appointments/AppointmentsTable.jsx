export default function AppointmentsTable({ appointments }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Date of Visit</th>
            <th className="border px-4 py-2">Next Appointment</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Complaint</th>
            <th className="border px-4 py-2">Service</th>
            <th className="border px-4 py-2">Visit Status</th>
            <th className="border px-4 py-2">Balance</th>
            <th className="border px-4 py-2">Debit</th>
            <th className="border px-4 py-2">Credit</th>
            <th className="border px-4 py-2">Note</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{appt.date_of_visit}</td>
              <td className="border px-4 py-2">{appt.next_appointment || "–"}</td>
              <td className="border px-4 py-2">{appt.patient_name}</td>
              <td className="border px-4 py-2" title={appt.fullComplaint}>{appt.complaint}</td>
              <td className="border px-4 py-2" title={appt.fullService}>{appt.service}</td>
              <td className="border px-4 py-2 capitalize">{appt.visit_status}</td>
              <td className="border px-4 py-2">{appt.balance}</td>
              <td className="border px-4 py-2">{appt.debit}</td>
              <td className="border px-4 py-2">{appt.credit}</td>
              <td className="border px-4 py-2" title={appt.fullNote}>{appt.note || "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}