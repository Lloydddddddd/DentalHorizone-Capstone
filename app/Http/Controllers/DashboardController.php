<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private const CLINIC_TZ = 'Asia/Manila';

    public function index(): Response
    {
        $now = now(self::CLINIC_TZ);

        $dayStart   = $now->copy()->startOfDay();
        $dayEnd     = $now->copy()->endOfDay();
        $weekStart  = $now->copy()->startOfWeek(Carbon::MONDAY);
        $weekEnd    = $now->copy()->endOfWeek(Carbon::SUNDAY);
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd   = $now->copy()->endOfMonth();

        $prevWeekStart  = $weekStart->copy()->subWeek();
        $prevWeekEnd    = $weekStart->copy()->subSecond();
        $prevMonthStart = $monthStart->copy()->subMonthNoOverflow();
        $prevMonthEnd   = $monthStart->copy()->subSecond();

        /* ─── Stat cards ─────────────────────────────────────────── */

        $todayBase = fn () => DB::table('appointments')
            ->whereBetween('next_appointment', $this->range($dayStart, $dayEnd))
            ->where('visit_status', '!=', 'cancelled');

        $todayTotal     = $todayBase()->count();
        $remainingToday = $todayBase()
            ->whereIn('visit_status', ['pending', 'confirmed'])
            ->where('next_appointment', '>', $this->db($now))
            ->count();

        $activePatients = Patient::count();
        $newPatients    = Patient::whereBetween('created_at', $this->range($monthStart, $monthEnd))->count();
        $pendingRequests = DB::table('appointments')->where('visit_status', 'pending')->count();

        $revenueFor = fn (Carbon $from, Carbon $to): float => (float) DB::table('appointments')
            ->whereBetween('date_of_visit', $this->range($from, $to))
            ->where('visit_status', '!=', 'cancelled')
            ->sum('credit');

        $monthlyRevenue = $revenueFor($monthStart, $monthEnd);
        $prevRevenue    = $revenueFor($prevMonthStart, $prevMonthEnd);
        $revenueChange  = $prevRevenue > 0
            ? round((($monthlyRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
            : null;

        /* ─── Clinic overview ─────────────────────────────────────── */

        $activityFor = function (Carbon $from, Carbon $to): array {
            $rows = DB::table('appointments')
                ->selectRaw('LOWER(visit_status) as status, COUNT(*) as total')
                ->whereBetween('next_appointment', $this->range($from, $to))
                ->groupBy(DB::raw('LOWER(visit_status)'))
                ->pluck('total', 'status');

            $total     = (int) $rows->sum();
            $completed = (int) ($rows['completed'] ?? 0);
            $cancelled = (int) ($rows['cancelled'] ?? 0);

            return [
                'total'     => $total,
                'completed' => $completed,
                'cancelled' => $cancelled,
                'pending'   => $total - $completed - $cancelled,
            ];
        };

        $activity     = $activityFor($weekStart, $weekEnd);
        $prevActivity = $activityFor($prevWeekStart, $prevWeekEnd);
        $activity['change'] = $prevActivity['total'] > 0
            ? (int) round((($activity['total'] - $prevActivity['total']) / $prevActivity['total']) * 100)
            : null;

        /* ─── Today's schedule + calendar ─────────────────────────── */

        $todayAppointments = Appointment::with(['patient:id,patient_name', 'services:id,name'])
            ->whereBetween('next_appointment', $this->range($dayStart, $dayEnd))
            ->where('visit_status', '!=', 'cancelled')
            ->orderBy('next_appointment')
            ->get()
            ->map(fn (Appointment $a) => $this->mapAppointment($a))
            ->values();

        // Calendar: every non-cancelled appointment (so pills match the Appointments list)
        $calendarAppointments = Appointment::with(['patient:id,patient_name', 'services:id,name'])
            ->whereNotNull('next_appointment')
            ->where('visit_status', '!=', 'cancelled')
            ->orderBy('next_appointment')
            ->get()
            ->map(fn (Appointment $a) => $this->mapAppointment($a))
            ->values();

        return Inertia::render('Dashboard/Pages/Dashboard', [
            'today' => [
                'label'    => $now->format('l, F j'),
                'full'     => $now->format('F j, Y'),
                'greeting' => $now->hour < 12 ? 'Good morning' : ($now->hour < 18 ? 'Good afternoon' : 'Good evening'),
            ],
            'stats' => [
                'todays_appointments'  => $todayTotal,
                'remaining_today'      => $remainingToday,
                'active_patients'      => $activePatients,
                'new_patients_month'   => $newPatients,
                'pending_requests'     => $pendingRequests,
                'monthly_revenue'      => $monthlyRevenue,
                'revenue_change'       => $revenueChange,
                'previous_month_label' => $prevMonthStart->format('M'),
            ],
            'activity'             => $activity,
            'todayAppointments'    => $todayAppointments,
            'calendarAppointments' => $calendarAppointments,
        ]);
    }

    /** Express a clinic-time range in the app timezone, which is how the DB stores datetimes. */
    private function range(Carbon $from, Carbon $to): array
    {
        return [$this->db($from), $this->db($to)];
    }

    private function db(Carbon $moment): Carbon
    {
        return $moment->copy()->setTimezone(config('app.timezone'));
    }

    /**
     * Shared shape used by Dashboard, TodaySchedule, and CalendarModal.
     * Mirrors AppointmentController::mapAppointment() so statuses stay consistent.
     */
    private function mapAppointment(Appointment $appt): array
    {
        $rawNext = $appt->getRawOriginal('next_appointment');
        $rawDate = $appt->getRawOriginal('date_of_visit');

        $service = $appt->services->isNotEmpty()
            ? $appt->services->pluck('name')->join(', ')
            : ($appt->complaint ?: '—');

        $balance = is_null($appt->balance) ? 0.0 : (float) $appt->balance;

        return [
            // Table/row basics
            'id'                   => $appt->id,
            'patient_id'           => $appt->patient_id,
            'patient_name'         => $appt->patient?->patient_name ?? '—',
            'service'              => $service,
            'complaint'            => $appt->complaint,
            'note'                 => $appt->note,
            'fullComplaint'        => $appt->complaint,
            'fullNote'             => $appt->note,

            // Dates
            'date_of_visit'        => $rawDate,
            'next_appointment'     => $rawNext,
            'next_appointment_raw' => $rawNext ?: $rawDate,

            // Statuses (top-level for the table, mirrored into appointment_status)
            'visit_status'         => $appt->visit_status,
            'appointment_status'   => $appt->appointment_status ?? $appt->visit_status,

            // Money
            'debit'                => (float) $appt->debit,
            'credit'               => (float) $appt->credit,
            'balance'              => $balance,
        ];
    }
}