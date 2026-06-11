<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Appointment::with(['patient', 'services']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('patient_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('visit_status', $request->input('status'));
        }

        $query->orderBy('created_at', 'desc');

        $appointments = $query->paginate(10)->withQueryString();

        return inertia('Appointments/Pages/Index', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
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

        return inertia('Appointments/Pages/Upcoming', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status']),
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

        return inertia('Appointments/Pages/Missed', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status']),
        ]);
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
            'visit_status' => 'required|string|max:50',
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
            'visit_status' => 'required|string|max:50',
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
