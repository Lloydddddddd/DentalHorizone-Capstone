<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['patient', 'services']);
        $now = Carbon::now();
        // Rows without a follow-up use their date of visit as the schedule date.
        $appointmentAt = 'COALESCE(next_appointment, date_of_visit)';

        $tab = $request->input('tab');
        if ($tab === 'upcoming') {
            $query->whereRaw("{$appointmentAt} > ?", [$now->toDateTimeString()])
                  ->where('visit_status', '!=', 'cancelled');
        } elseif ($tab === 'missed') {
            $query->whereRaw("{$appointmentAt} < ?", [$now->toDateTimeString()])
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

        $query->orderByRaw("{$appointmentAt} desc");

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
        $appointmentAt = 'COALESCE(next_appointment, date_of_visit)';

        $query = Appointment::with(['patient', 'services'])
            ->whereRaw("{$appointmentAt} > ?", [$now->toDateTimeString()])
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

        $appointments = $query->orderByRaw("{$appointmentAt} asc")
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
        $appointmentAt = 'COALESCE(next_appointment, date_of_visit)';

        $query = Appointment::with(['patient', 'services'])
            ->whereRaw("{$appointmentAt} < ?", [$now->toDateTimeString()])
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

        $appointments = $query->orderByRaw("{$appointmentAt} desc")
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

    protected function mapAppointment(Appointment $appt): array
    {
        $rawNextAppointment = $appt->getRawOriginal('next_appointment');
        $rawDateOfVisit     = $appt->getRawOriginal('date_of_visit');

        $serviceNames = $appt->services->isNotEmpty()
            ? $appt->services->pluck('name')->join(', ')
            : '—';

        $balance = is_null($appt->balance) ? 0.0 : (float) $appt->balance;

        return [
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
            'patient_name'         => $appt->patient?->patient_name ?? '—',
            'service'              => $serviceNames,
            'fullComplaint'        => $appt->complaint,
            'fullNote'             => $appt->note,
        ];
    }

    protected function buildStats(): array
    {
        $now = Carbon::now();

        $dayStart = $now->copy()->startOfDay();
        $dayEnd   = $now->copy()->endOfDay();
        $weekEnd  = $now->copy()->addDays(7)->endOfDay();

        $today = Appointment::whereRaw('COALESCE(next_appointment, date_of_visit) BETWEEN ? AND ?', [
                $dayStart->toDateTimeString(),
                $dayEnd->toDateTimeString(),
            ])
            ->where('visit_status', '!=', 'cancelled')
            ->count();

        $remainingToday = Appointment::whereRaw('COALESCE(next_appointment, date_of_visit) BETWEEN ? AND ?', [
                $dayStart->toDateTimeString(),
                $dayEnd->toDateTimeString(),
            ])
            ->whereIn('visit_status', ['pending', 'confirmed'])
            ->whereRaw('COALESCE(next_appointment, date_of_visit) > ?', [$now->toDateTimeString()])
            ->count();

        $upcoming = Appointment::whereRaw('COALESCE(next_appointment, date_of_visit) BETWEEN ? AND ?', [
                $now->toDateTimeString(),
                $weekEnd->toDateTimeString(),
            ])
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

    protected function patientOptions()
    {
        return Patient::select('id', 'patient_name')->orderBy('patient_name')->get();
    }

    protected function serviceOptions()
    {
        return Service::select('id', 'name', 'price')->orderBy('name')->get();
    }

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
            'services.*.teeth' => 'nullable|array',
            'services.*.teeth.*' => 'integer|between:1,32',
        ]);

        if ($request->boolean('no_next_appointment')) {
            $validated['next_appointment'] = null;
        } elseif ($request->filled('next_appointment')) {
            $validated['next_appointment'] = Carbon::parse($request->input('next_appointment'));
        }

        $validated['balance'] = ($validated['debit'] ?? 0) - ($validated['credit'] ?? 0);

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
            $teeth = $this->normalizeTeeth($srv['teeth'] ?? []);

            $appointment->services()->attach($srv['id'], [
                'note' => $srv['note'] ?? null,
                'teeth' => $teeth ? json_encode($teeth) : null,
            ]);
        }

        // BILLING
        $subtotal = $appointment->services->sum('price');
        if ($subtotal > 0) {
            $billId = DB::table('bills')->insertGetId([
                'patient_id' => $appointment->patient_id,
                'appointment_id' => $appointment->id,
                'subtotal' => $subtotal,
                'discount' => 0,
                'total_amount' => $subtotal,
                'amount_paid' => $validated['credit'] ?? 0,
                'balance' => $subtotal - ($validated['credit'] ?? 0),
                'payment_status' => ($validated['credit'] ?? 0) >= $subtotal ? 'paid' : (($validated['credit'] ?? 0) > 0 ? 'partial' : 'unpaid'),
                'billing_date' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($appointment->services as $service) {
                DB::table('bill_items')->insert([
                    'bill_id' => $billId,
                    'service_id' => $service->id,
                    'quantity' => 1,
                    'unit_price' => $service->price,
                    'subtotal' => $service->price,
                    'teeth' => $service->pivot->teeth ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return redirect()->route('appointments.index');
    }

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
            ->whereIn('visit_status', ['pending', 'confirmed'])
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
            'next_appointment'=> $validated['next_appointment'],
            'visit_status'   => 'pending',
            'debit'          => 0,
            'credit'         => 0,
            'balance'        => 0,
            'note'           => $validated['note'] ?? null,
        ]);

        foreach ($validated['services'] as $srvId) {
            $appointment->services()->attach($srvId, [
                'note'  => null 
            ]);
        }

        // BILLING FOR PUBLIC BOOKING
        $subtotal = $appointment->services->sum('price');
        if ($subtotal > 0) {
            $billId = DB::table('bills')->insertGetId([
                'patient_id' => $appointment->patient_id,
                'appointment_id' => $appointment->id,
                'subtotal' => $subtotal,
                'discount' => 0,
                'total_amount' => $subtotal,
                'amount_paid' => 0,
                'balance' => $subtotal,
                'payment_status' => 'unpaid',
                'billing_date' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($appointment->services as $service) {
                DB::table('bill_items')->insert([
                    'bill_id' => $billId,
                    'service_id' => $service->id,
                    'quantity' => 1,
                    'unit_price' => $service->price,
                    'subtotal' => $service->price,
                    'teeth' => $service->pivot->teeth ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
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
        $appointment->visit_status = 'rescheduled';
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
            'services.*.teeth' => 'nullable|array',
            'services.*.teeth.*' => 'integer|between:1,32',
        ]);

        if ($request->boolean('no_next_appointment')) {
            $validated['next_appointment'] = null;
        } elseif ($request->filled('next_appointment')) {
            $validated['next_appointment'] = Carbon::parse($request->input('next_appointment'));
        }

        $validated['balance'] = ($validated['debit'] ?? 0) - ($validated['credit'] ?? 0);

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

        $appointment->services()->sync(
            collect($validated['services'])->mapWithKeys(function ($srv) {
                $teeth = $this->normalizeTeeth($srv['teeth'] ?? []);

                return [
                    $srv['id'] => [
                        'note' => $srv['note'] ?? null,
                        'teeth' => $teeth ? json_encode($teeth) : null,
                    ],
                ];
            })
        );

        return redirect()->route('appointments.index')->with('success', 'Appointment updated successfully.');
    }

    /**
     * Keep only valid Universal Numbering System tooth numbers (1-32),
     * de-duplicated and sorted.
     */
    protected function normalizeTeeth(array $teeth = []): array
    {
        return collect($teeth)
            ->map(fn ($tooth) => (int) $tooth)
            ->filter(fn ($tooth) => $tooth >= 1 && $tooth <= 32)
            ->unique()
            ->sort()
            ->values()
            ->all();
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