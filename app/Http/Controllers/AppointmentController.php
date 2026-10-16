<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['patient', 'services']);
        $now = Carbon::now();

        // Tab filter from the All / Upcoming / Missed pills
        $tab = $request->input('tab');
        if ($tab === 'upcoming') {
            $query->whereNotNull('next_appointment')
                  ->where('next_appointment', '>', $now)
                  ->where('visit_status', '!=', 'cancelled');
        } elseif ($tab === 'missed') {
            $query->whereNotNull('next_appointment')
                  ->where('next_appointment', '<', $now)
                  ->where('visit_status', '!=', 'cancelled');
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('patient_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('visit_status', $request->input('status'));
        }

        $query->orderBy('next_appointment', 'desc');

        $appointments = $query->paginate(10)->withQueryString();
        $appointments->through(fn (Appointment $a) => $this->mapAppointment($a));

        return inertia('Appointments/Pages/Index', [
            'appointments'     => $appointments,
            'appointmentStats' => $this->buildStats(),
            'patients'         => $this->patientOptions(),
            'services'         => $this->serviceOptions(),
            'filters'          => $request->only(['search', 'status', 'tab', 'sort', 'direction']),
        ]);
    }

    public function upcoming(Request $request)
    {
        $now = Carbon::now();

        $query = Appointment::with(['patient', 'services'])
            ->whereNotNull('next_appointment')
            ->where(function ($q) use ($now) {
                $q->where('next_appointment', '>', $now); // future
            })
            ->where('visit_status', '!=', 'cancelled');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('patient_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('visit_status', $request->input('status'));
        }

        $appointments = $query->orderBy('next_appointment', 'asc')
            ->paginate(10)
            ->withQueryString();
        $appointments->through(fn (Appointment $a) => $this->mapAppointment($a));

        return inertia('Appointments/Pages/Upcoming', [
            'appointments'     => $appointments,
            'appointmentStats' => $this->buildStats(),
            'patients'         => $this->patientOptions(),
            'services'         => $this->serviceOptions(),
            'filters'          => $request->only(['search', 'status']),
        ]);
    }

    public function missed(Request $request)
    {
        $now = Carbon::now();

        $query = Appointment::with(['patient', 'services'])
            ->whereNotNull('next_appointment')
            ->where(function ($q) use ($now) {
                $q->where('next_appointment', '<', $now); // past
            })
            ->where('visit_status', '!=', 'cancelled');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('patient_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('visit_status', $request->input('status'));
        }

        $appointments = $query->orderBy('next_appointment', 'desc')
            ->paginate(10)
            ->withQueryString();
        $appointments->through(fn (Appointment $a) => $this->mapAppointment($a));

        return inertia('Appointments/Pages/Missed', [
            'appointments'     => $appointments,
            'appointmentStats' => $this->buildStats(),
            'patients'         => $this->patientOptions(),
            'services'         => $this->serviceOptions(),
            'filters'          => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Shape a single Appointment row for the front-end table + modals.
     * Columns follow the appointments migration; related data is flattened.
     */
    protected function mapAppointment(Appointment $appt): array
    {
        // Raw values (before Carbon casts) so the front end can format timezones itself.
        $rawNextAppointment = $appt->getRawOriginal('next_appointment');
        $rawDateOfVisit     = $appt->getRawOriginal('date_of_visit');

        // Services come from the pivot; fall back to em-dash when nothing is attached.
        $serviceNames = $appt->services->isNotEmpty()
            ? $appt->services->pluck('name')->join(', ')
            : '—';

        // Balance may be null in the DB; default to 0.00 so it doesn't render as "—".
        $balance = is_null($appt->balance) ? 0.0 : (float) $appt->balance;

        return [
            // ── Direct columns from the appointments table ────────────
            'id'                   => $appt->id,
            'patient_id'           => $appt->patient_id,
            'complaint'            => $appt->complaint,
            'date_of_visit'        => $rawDateOfVisit,
            'next_appointment'     => $rawNextAppointment,
            'next_appointment_raw' => $rawNextAppointment ?: $rawDateOfVisit,
            'visit_status'         => $appt->visit_status,
            'appointment_status'   => $appt->appointment_status ?? $appt->visit_status,
            'note'                 => $appt->note,
            'debit'                => (float) $appt->debit,
            'credit'               => (float) $appt->credit,
            'balance'              => $balance,

            // ── Related data flattened for the table ──────────────────
            'patient_name'         => $appt->patient?->patient_name ?? '—',
            'service'              => $serviceNames,

            // ── Aliases the details modal reads ───────────────────────
            'fullComplaint'        => $appt->complaint,
            'fullNote'             => $appt->note,
        ];
    }

    /**
     * Compute the counts shown in the stats bar across all views.
     *
     * Today        — every non-cancelled appointment whose next_appointment is today
     * Remaining    — today's pending/confirmed appointments still in the future
     * Upcoming     — non-cancelled appointments within the next 7 days
     * Pending      — all appointments with visit_status = 'pending'
     */
    protected function buildStats(): array
    {
        $now = Carbon::now();

        $dayStart = $now->copy()->startOfDay();
        $dayEnd   = $now->copy()->endOfDay();
        $weekEnd  = $now->copy()->addDays(7)->endOfDay();

        $today = Appointment::whereBetween('next_appointment', [$dayStart, $dayEnd])
            ->where('visit_status', '!=', 'cancelled')
            ->count();

        $remainingToday = Appointment::whereBetween('next_appointment', [$dayStart, $dayEnd])
            ->whereIn('visit_status', ['pending', 'confirmed'])
            ->where('next_appointment', '>', $now)
            ->count();

        $upcoming = Appointment::whereBetween('next_appointment', [$now, $weekEnd])
            ->where('visit_status', '!=', 'cancelled')
            ->count();

        $pending = Appointment::where('visit_status', 'pending')->count();

        return [
            'today'            => $today,
            'remaining_today'  => $remainingToday,
            'upcoming'         => $upcoming,
            'pending'          => $pending,
        ];
    }

    /**
     * Slim payload for the New Appointment patient dropdown.
     */
    protected function patientOptions()
    {
        return Patient::select('id', 'patient_name')
            ->orderBy('patient_name')
            ->get();
    }

    /**
     * Slim payload for the New Appointment service dropdown.
     */
    protected function serviceOptions()
    {
        return Service::select('id', 'name', 'price')
            ->orderBy('name')
            ->get();
    }

    /**
     * Store a newly created resource in storage (Admin/Secretary use).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'complaint' => 'required|string|max:200',
            'date_of_visit' => 'required|date',
            'next_appointment' => 'nullable|date',
            'no_next_appointment' => 'nullable|boolean',
            'visit_status' => 'required|in:pending,confirmed,rescheduled,missed,completed,cancelled',
            'debit' => 'nullable|numeric|min:0',
            'credit' => 'nullable|numeric|min:0',
            'balance' => 'nullable|numeric',
            'note' => 'nullable|string|max:500',
            'services' => 'required|array|min:1',
            'services.*.id' => 'required|exists:services,id',
            'services.*.note' => 'nullable|string|max:500',
        ]);

        if ($request->boolean('no_next_appointment')) {
            $validated['next_appointment'] = null;
        } elseif ($request->filled('next_appointment')) {
            $validated['next_appointment'] = Carbon::parse($request->input('next_appointment'));
        }

        $validated['balance'] = ($validated['debit'] ?? 0) - ($validated['credit'] ?? 0);

        // Prevent overlapping schedule for admin-created appointments
        $conflict = Appointment::whereIn('visit_status', ['pending', 'confirmed'])
            ->where('next_appointment', $validated['next_appointment'])
            ->exists();

        if ($conflict) {
            return redirect()->back()->withErrors([
                'next_appointment' => 'This time slot is already taken. Please choose another.',
            ])->withInput();
        }

        $appointment = Appointment::create([
            'patient_id' => $validated['patient_id'],
            'complaint' => $validated['complaint'],
            'date_of_visit' => $validated['date_of_visit'],
            'next_appointment' => $validated['next_appointment'],
            'visit_status' => $validated['visit_status'],
            'debit' => $validated['debit'] ?? 0,
            'credit' => $validated['credit'] ?? 0,
            'balance' => $validated['balance'],
            'note' => $validated['note'] ?? null,
        ]);

        foreach ($validated['services'] as $srv) {
            $appointment->services()->attach($srv['id'], [
                'note' => $srv['note'] ?? null,
            ]);
        }

        return redirect()->route('appointments.index');
    }

    /**
     * Store appointment from public "Book Appointment" form.
     */
    public function publicStore(Request $request)
    {
        $validated = $request->validate([
            'patient_name'   => 'required|string|max:100',
            'email'          => 'required|email|max:100',
            'telephone'      => 'required|string|max:50',
            'age'            => 'required|integer|min:0',
            'occupation'     => 'nullable|string|max:100',
            'address'        => 'nullable|string|max:200',
            'next_appointment' => 'required|date_format:Y-m-d\TH:i',
            'services'       => 'required|array|min:1',
            'services.*'     => 'exists:services,id',
            'complaint'      => 'nullable|string|max:200',
            'note'           => 'nullable|string|max:500',
        ]);

        $conflict = Appointment::where('next_appointment', $validated['next_appointment'])
            ->whereIn('visit_status', ['pending', 'confirmed']) // only block active appointments
            ->exists();

        if ($conflict) {
            return redirect()->back()->withErrors([
                'next_appointment' => 'This time slot is already taken. Please choose another.',
            ])->withInput();
        }

        $patient = Patient::updateOrCreate(
            ['email' => $validated['email']],
            [
                'patient_name' => $validated['patient_name'],
                'telephone'    => $validated['telephone'] ?? null,
                'age'          => $validated['age'],
                'occupation'   => $validated['occupation'] ?? null,
                'address'      => $validated['address'] ?? null,
            ]
        );

        $appointment = Appointment::create([
            'patient_id'     => $patient->id,
            'complaint'      => $validated['complaint'] ?? null,
            'date_of_visit'  => null,
            'next_appointment'=> $validated['next_appointment'], // align with upcoming/missed logic
            'visit_status'   => 'pending', // standardized lowercase
            'debit'          => 0,
            'credit'         => 0,
            'balance'        => 0,
            'note'           => $validated['note'] ?? null,
        ]);

        foreach ($validated['services'] as $srvId) {
            $appointment->services()->attach($srvId, [
                'note'  => null // optional pivot note
            ]);
        }

        return redirect()->back()->with('success', 'Your appointment request has been submitted!');
    }

    public function reschedule(Request $request, $id)
    {
        $validated = $request->validate([
            'date_of_visit' => 'required|date',
            'next_appointment' => 'nullable|date',
        ]);

        $appointment = Appointment::findOrFail($id);

        // Prevent overlapping schedule
        $conflict = Appointment::where('id', '!=', $id)
            ->whereIn('visit_status', ['pending', 'confirmed'])
            ->where('next_appointment', $validated['next_appointment'])
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'This time slot is already taken. Please choose another.'
            ], 422);
        }

        $appointment->date_of_visit = $validated['date_of_visit'];
        $appointment->next_appointment = $validated['next_appointment'] ?? $validated['date_of_visit'];
        $appointment->visit_status = 'rescheduled'; // mark it explicitly
        $appointment->save();

        return response()->json(['message' => 'Appointment rescheduled successfully']);
    }

    public function edit($id)
    {
        $appointment = Appointment::with(['patient', 'services'])->findOrFail($id);

        return inertia('Appointments/Pages/Edit', [
            'appointment' => $appointment,
            'services' => \App\Models\Service::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'complaint' => 'required|string|max:200',
            'date_of_visit' => 'required|date',
            'next_appointment' => 'nullable|date',
            'no_next_appointment' => 'nullable|boolean',
            'visit_status' => 'required|in:pending,confirmed,rescheduled,missed,completed,cancelled',
            'debit' => 'nullable|numeric|min:0',
            'credit' => 'nullable|numeric|min:0',
            'balance' => 'nullable|numeric',
            'note' => 'nullable|string|max:500',
            'services' => 'required|array|min:1',
            'services.*.id' => 'required|exists:services,id',
            'services.*.note' => 'nullable|string|max:500',
        ]);

        if ($request->boolean('no_next_appointment')) {
            $validated['next_appointment'] = null;
        } elseif ($request->filled('next_appointment')) {
            $validated['next_appointment'] = Carbon::parse($request->input('next_appointment'));
        }

        $validated['balance'] = ($validated['debit'] ?? 0) - ($validated['credit'] ?? 0);

        // Prevent overlapping schedule when editing
        $conflict = Appointment::where('id', '!=', $id)
            ->whereIn('visit_status', ['pending', 'confirmed'])
            ->where('next_appointment', $validated['next_appointment'])
            ->exists();

        if ($conflict) {
            return redirect()->back()->withErrors([
                'next_appointment' => 'This time slot is already taken. Please choose another.',
            ])->withInput();
        }

        $appointment = Appointment::findOrFail($id);
        $appointment->update([
            'complaint' => $validated['complaint'],
            'date_of_visit' => $validated['date_of_visit'],
            'next_appointment' => $validated['next_appointment'],
            'visit_status' => $validated['visit_status'],
            'debit' => $validated['debit'] ?? 0,
            'credit' => $validated['credit'] ?? 0,
            'balance' => $validated['balance'],
            'note' => $validated['note'] ?? null,
        ]);

        // Sync services with pivot notes
        $appointment->services()->sync(
            collect($validated['services'])->mapWithKeys(fn($srv) => [
                $srv['id'] => ['note' => $srv['note'] ?? null],
            ])
        );

        return redirect()->route('appointments.index')->with('success', 'Appointment updated successfully.');
    }

    public function cancel($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->visit_status = 'cancelled';
        $appointment->save();

        return response()->json(['message' => 'Appointment cancelled successfully']);
    }

    public function create() {}
    public function show(string $id) {}
    public function destroy(string $id) {}
}