<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Patient;
use Illuminate\Support\Facades\Redirect;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $patients = Patient::orderBy('patient_name')->paginate(20);
        return Inertia::render('Patients/Index', [
            'patients' => $patients,
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
}
