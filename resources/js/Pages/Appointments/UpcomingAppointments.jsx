import React from 'react';

const UpcomingAppointments = ({ appointments }) => {
  const reschedule = (id) => {
    alert('Reschedule appointment: ' + id);
  };

  const cancel = (id) => {
    alert('Cancel appointment: ' + id);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-6 text-gray-800">Upcoming Appointments</h1>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-6 py-4 text-left">Patient Name</th>
            <th className="px-6 py-4 text-left">Next Appointment</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b">
              <td className="px-6 py-4">{appointment.patient_name}</td>
              <td className="px-6 py-4">{appointment.next_appointment}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => reschedule(appointment.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => cancel(appointment.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingAppointments;