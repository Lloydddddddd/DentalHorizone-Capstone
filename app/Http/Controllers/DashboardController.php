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
        $now = now();

        $totalPatients = Patient::count();

        $upcomingAppointments = DB::table('appointments')
            ->whereNotNull('next_appointment')
            ->where('next_appointment', '>', $now)
            ->count();

        $todaysAppointments = DB::table('appointments')
        ->whereNotNull('next_appointment')
        ->whereDate('next_appointment', $now->toDateString())
        ->where('next_appointment', '>=', $now)
        ->count();

        $missedAppointments = DB::table('appointments')
            ->whereNotNull('next_appointment')
            ->where('next_appointment', '<', $now)
            ->count();

        $todayAppointments = DB::table('appointments')
        ->whereNotNull('next_appointment')
        ->whereDate('next_appointment', $now->toDateString())
        ->where('next_appointment', '>=', $now)
        ->get();

        $calendarAppointments = DB::table('appointments')
            ->whereNotNull('next_appointment')
            ->get();

        $stats = [
            'total_patients'        => $totalPatients,
            'upcoming_appointments' => $upcomingAppointments,
            'todays_appointments'   => $todaysAppointments,
            'missed_appointments'   => $missedAppointments,
        ];

        return Inertia::render('Dashboard', [
            'stats'                => $stats,
            'todayAppointments'    => $todayAppointments,
            'calendarAppointments' => $calendarAppointments,
        ]);
    }
}