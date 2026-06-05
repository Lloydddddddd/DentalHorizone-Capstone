import AppointmentsPage from "@/Pages/Appointments/AppointmentsPage";

export default function Missed(props) {
  return <AppointmentsPage {...props} title="Missed Appointments" routeName="appointments.missed" />;
}