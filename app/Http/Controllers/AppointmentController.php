<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Appointment::with('patient');

        // Search by patient name
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('patient_name', 'like', "%{$search}%");
            });
        }

        // Filter by visit status
        if ($request->filled('status')) {
            $query->where('visit_status', $request->input('status'));
        }

        // Sorting
        $sort = $request->input('sort', 'date_of_visit'); // default sort
        $direction = $request->input('direction', 'desc'); // default direction
        $query->orderBy($sort, $direction);

        $appointments = $query->paginate(10)->withQueryString();

        return inertia('Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    public function upcoming(Request $request)
    {
        $now = Carbon::now();

        $query = Appointment::with('patient')
            ->whereNotNull('next_appointment')
            ->where('next_appointment', '>', $now);

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

        return inertia('Appointments/Upcoming', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function missed(Request $request)
    {
        $now = Carbon::now();

        $query = Appointment::with('patient')
            ->whereNotNull('next_appointment')
            ->where('next_appointment', '<', $now);

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

        return inertia('Appointments/Missed', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'complaint' => 'required|string|max:200',
            'service' => 'required|string|max:100',
            'date_of_visit' => 'required|date',
            'next_appointment' => 'nullable|date',
            'no_next_appointment' => 'nullable|boolean',
            'visit_status' => 'required|string|max:50',
            'debit' => 'nullable|numeric|min:0',
            'credit' => 'nullable|numeric|min:0',
            'balance' => 'nullable|numeric',
        ]);

        if ($request->boolean('no_next_appointment')) {
            $validated['next_appointment'] = null;
        } elseif ($request->filled('next_appointment')) {
            $validated['next_appointment'] = Carbon::parse($request->input('next_appointment'));
        }

        $validated['balance'] = ($validated['debit'] ?? 0) - ($validated['credit'] ?? 0);

        Appointment::create($validated);

        return redirect()->route('appointments.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
