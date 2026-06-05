import AppointmentsPage from "@/Pages/Appointments/AppointmentsPage";

export default function Upcoming(props) {
  return <AppointmentsPage {...props} title="Upcoming Appointments" routeName="appointments.upcoming" />;
}