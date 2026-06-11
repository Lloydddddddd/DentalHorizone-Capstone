<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;
use App\Models\Appointment;
use Carbon\Carbon;

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
            ->count();

        $missedAppointments = DB::table('appointments')
            ->whereNotNull('next_appointment')
            ->where('next_appointment', '<', $now)
            ->count();

        $todayAppointments = Appointment::with(['patient:id,patient_name','services:id,name'])
            ->whereNotNull('next_appointment')
            ->whereDate('next_appointment', $now->toDateString())
            ->get()
            ->map(function ($appt) {
                return [
                    'id'                   => $appt->id,
                    'date_of_visit'        => $appt->getRawOriginal('date_of_visit'),
                    'next_appointment'     => $appt->next_appointment,
                    'next_appointment_raw' => $appt->getRawOriginal('next_appointment') ?? null,
                    'time'                 => $appt->getRawOriginal('next_appointment')
                                                    ? \Carbon\Carbon::parse($appt->getRawOriginal('next_appointment'))
                                                        ->timezone('Asia/Manila')
                                                        ->format('h:i A')
                                                    : null,
                    'patient_name'         => $appt->patient ? $appt->patient->patient_name : '—',
                    'service'              => $appt->services->isNotEmpty()
                                                ? $appt->services->pluck('name')->join(', ')
                                                : '—', 
                    'visit_status'         => $appt->visit_status,
                ];
            });

        $calendarAppointments = Appointment::with(['patient:id,patient_name','services:id,name'])
            ->whereNotNull('next_appointment')
            ->get()
            ->map(function ($appt) {
                return [
                    'id'                   => $appt->id,
                    'date_of_visit'        => $appt->getRawOriginal('date_of_visit'),
                    'next_appointment'     => $appt->next_appointment,
                    'next_appointment_raw' => $appt->getRawOriginal('next_appointment') ?? null,
                    'time'                 => $appt->getRawOriginal('next_appointment')
                                                    ? \Carbon\Carbon::parse($appt->getRawOriginal('next_appointment'))
                                                        ->timezone('Asia/Manila')
                                                        ->format('h:i A')
                                                    : null,
                    'patient_name'         => $appt->patient ? $appt->patient->patient_name : '—',
                    'service'              => $appt->services->isNotEmpty()
                                                ? $appt->services->pluck('name')->join(', ')
                                                : '—', 
                    'visit_status'         => $appt->visit_status,
                ];
            });

        $stats = [
            'total_patients'        => $totalPatients,
            'todays_appointments'   => $todaysAppointments,
            'upcoming_appointments' => $upcomingAppointments,
            'missed_appointments'   => $missedAppointments,
        ];

        return Inertia::render('Dashboard/Pages/Dashboard', [
            'stats'                => $stats,
            'todayAppointments'    => $todayAppointments,
            'calendarAppointments' => $calendarAppointments,
        ]);
    }
}