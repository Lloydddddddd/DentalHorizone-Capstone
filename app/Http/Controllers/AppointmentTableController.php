<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentTableController extends Controller
{
    public function upcoming()
    {
        // Fetch upcoming appointments
        $appointments = Appointment::where('next_appointment', '>=', now())
            ->where('visit_status', '!=', 'completed')
            ->where('visit_status', '!=', 'cancelled')
            ->get();

        return inertia('Appointments/Upcoming', [
            'appointments' => $appointments,
        ]);
    }

    public function missed()
    {
        // Fetch missed appointments
        $appointments = Appointment::where('next_appointment', '<', now())
            ->where('visit_status', '!=', 'completed')
            ->where('visit_status', '!=', 'cancelled')
            ->get();

        return inertia('Appointments/Missed', [
            'appointments' => $appointments,
        ]);
    }
}