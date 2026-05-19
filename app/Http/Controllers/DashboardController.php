<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();

        // Counts directly from the patients table — same source as PatientController
        $totalPatients = Patient::count();

        $upcomingAppointments = DB::table('appointments')
            ->whereNotNull('next_appointment')
            ->whereDate('next_appointment', '>', $today)
            ->count();

        $todaysAppointments = DB::table('appointments')
            ->whereDate('date_of_visit', $today)
            ->count();

        $missedAppointments = DB::table('appointments')
            ->whereDate('date_of_visit', $today)
            ->where('visit_status', 'missed')
            ->count();

        $stats = [
            'total_patients'                 => $totalPatients,
            'upcoming_appointments'          => $upcomingAppointments,
            'todays_appointments'            => $todaysAppointments,
            'missed_appointments'            => $missedAppointments,

            'total_patients_trend'           => '+0%',
            'total_patients_trend_up'        => true,
            'upcoming_appointments_trend'    => '+0%',
            'upcoming_appointments_trend_up' => true,
            'todays_appointments_trend'      => '+0%',
            'todays_appointments_trend_up'   => true,
            'missed_appointments_trend'      => '-0%',
            'missed_appointments_trend_up'   => false,
        ];

        return Inertia::render('Dashboard', [
            'stats'                => $stats,
            'todayAppointments'    => [],
            'calendarAppointments' => [],
        ]);
    }
}