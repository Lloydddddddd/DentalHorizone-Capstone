<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Patient;
use App\Models\ArchivedPatient;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Patient::query();

        // Search query across common fields
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('patient_name', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('occupation', 'like', "%{$search}%");
            });
        }

        // Filter by patient_status (Active / Inactive)
        if ($status = $request->input('status')) {
            $query->where('patient_status', $status);
        }

        $patients = $query->orderBy('patient_name')
                          ->paginate(20)
                          ->appends($request->only(['q', 'status']));

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'filters' => $request->only(['q', 'status']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'patient_name' => 'required|string|max:100',
            'age' => 'nullable|integer',
            'occupation' => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:200',
            'email' => 'nullable|email|max:150',
            'patient_status' => 'nullable|string|in:Active,Inactive',
        ]);

        if (empty($data['patient_status'])) {
            $data['patient_status'] = 'Active';
        }

        $data = array_merge([
            'complaint' => '',
            'date_of_visit' => now(),
            'next_appointment' => null,
            'service' => '',
            'visit_status' => 'none',
            'status' => 'active',
            'debit' => 0,
            'credit' => 0,
        ], $data);

        Patient::create($data);

        return Redirect::route('patients.index')->with('success', 'Patient created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $patient = Patient::findOrFail($id);
        return Inertia::render('Patients/Show', [
            'patient' => $patient,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Patients/Form', [
            'patient' => new Patient(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $patient = Patient::findOrFail($id);
        return Inertia::render('Patients/Form', [
            'patient' => $patient,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $patient = Patient::findOrFail($id);

        $data = $request->validate([
            'patient_name' => 'required|string|max:100',
            'age' => 'nullable|integer',
            'occupation' => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:200',
            'email' => 'nullable|email|max:150',
            'patient_status' => 'nullable|string|in:Active,Inactive',
        ]);

        $desiredStatus = $data['patient_status'] ?? 'Active';
        if ($desiredStatus === 'Inactive' && $patient->visitHistories()->exists()) {
            $data['patient_status'] = 'Active';
        }

        $patient->update($data);

        return Redirect::route('patients.index')->with('success', 'Patient updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();
        return Redirect::route('patients.index')->with('success', 'Patient deleted.');
    }

    /**
     * Archive the specified patient (copy to archived_patients and delete original).
     */
    public function archive(string $id)
    {
        $patient = Patient::findOrFail($id);

        // Copy patient data into archived_patients table
        DB::table('archived_patients')->insert([
            'patient_name' => $patient->patient_name,
            'address' => $patient->address,
            'telephone' => $patient->telephone,
            'age' => $patient->age,
            'occupation' => $patient->occupation,
            'complaint' => $patient->complaint,
            'date_of_visit' => $patient->date_of_visit,
            'next_appointment' => $patient->next_appointment,
            'service' => $patient->service,
            'patient_status' => $patient->patient_status,
            'visit_status' => $patient->visit_status,
            'status' => $patient->status,
            'email' => $patient->email ?? null,
            'debit' => $patient->debit ?? 0,
            'credit' => $patient->credit ?? 0,
            'user_id' => $patient->user_id ?? 1, // Default to 1 if user_id is null
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Remove original patient
        $patient->delete();

        return Redirect::route('patients.index')->with('success', 'Patient archived successfully.');
    }

    /**
     * Display a listing of archived patients.
     */
    public function archivedIndex()
    {
        $archived = ArchivedPatient::orderBy('patient_name')->paginate(20);
        return Inertia::render('ArchivedPatients/Index', [
            'archivedPatients' => $archived,
        ]);
    }

    /**
     * Restore an archived patient back into patients table.
     */
    public function restore(string $id)
    {
        $arch = ArchivedPatient::findOrFail($id);

        $data = [
            'patient_name' => $arch->patient_name,
            'address' => $arch->address,
            'telephone' => $arch->telephone,
            'age' => $arch->age,
            'occupation' => $arch->occupation,
            'complaint' => $arch->complaint,
            'date_of_visit' => $arch->date_of_visit ?? now(),
            'next_appointment' => $arch->next_appointment,
            'service' => $arch->service,
            'patient_status' => $arch->patient_status ?? 'Active',
            'visit_status' => $arch->visit_status ?? 'none',
            'status' => $arch->status ?? 'active',
            'debit' => $arch->debit ?? 0,
            'credit' => $arch->credit ?? 0,
            'email' => $arch->email ?? null,
        ];

        Patient::create($data);

        $arch->delete();

        return Redirect::route('archived-patients.index')->with('success', 'Patient restored.');
    }
}
