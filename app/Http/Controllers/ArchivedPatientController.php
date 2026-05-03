<?php

namespace App\Http\Controllers;

use App\Models\PatientVisitHistory;
use Illuminate\Http\Request;

class ArchivedPatientController extends Controller
{
    // List all visit histories
    public function index()
    {
        return response()->json(PatientVisitHistory::all());
    }

    // Store a new visit history
    public function store(Request $request)
    {
        $visit = PatientVisitHistory::create([
            'patient_id' => $request->patient_id,
            'user_id' => auth()->id(), // tie to logged-in user
            'service' => $request->service,
            'service_date' => $request->service_date,
            'debit' => $request->debit,
            'credit' => $request->credit,
        ]);

        return response()->json($visit, 201);
    }

    // Show a specific visit history
    public function show(string $id)
    {
        return response()->json(PatientVisitHistory::findOrFail($id));
    }

    // Update a visit history
    public function update(Request $request, string $id)
    {
        $visit = PatientVisitHistory::findOrFail($id);
        $visit->update($request->all());
        return response()->json($visit);
    }

    // Delete a visit history
    public function destroy(string $id)
    {
        PatientVisitHistory::destroy($id);
        return response()->json(null, 204);
    }
}