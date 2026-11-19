<?php

namespace App\Http\Controllers;

use App\Models\DentistAvailability;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class DentistAvailabilityController extends Controller
{
    /**
     * List all daily slots (with remaining count)
     */
    public function index(Request $request)
    {
        $query = DentistAvailability::query()->orderBy('available_date', 'asc');

        // Optional: filter by month
        if ($request->filled('month')) {
            $month = Carbon::parse($request->month . '-01');
            $query->whereMonth('available_date', $month->month)
                  ->whereYear('available_date', $month->year);
        }

        $slots = $query->get()->map(function ($slot) {
            return [
                'id'              => $slot->id,
                'available_date'  => $slot->available_date->format('Y-m-d'),
                'max_slots'       => $slot->max_slots,
                'booked'          => $slot->bookedCount(),
                'remaining'       => $slot->remainingSlots(),
                'start_time'      => $slot->start_time,
                'end_time'        => $slot->end_time,
                'is_closed'       => $slot->is_closed,
                'notes'           => $slot->notes,
            ];
        });

        return Inertia::render('Slots/Index', [
            'slots'   => $slots,
            'filters' => $request->only(['month']),
        ]);
    }

    /**
     * Store a new daily slot
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'available_date' => 'required|date|after_or_equal:today|unique:dentist_availability,available_date',
            'max_slots'      => 'required|integer|min:1|max:100',
            'start_time'     => 'nullable|date_format:H:i',
            'end_time'       => 'nullable|date_format:H:i|after:start_time',
            'is_closed'      => 'boolean',
            'notes'          => 'nullable|string|max:255',
        ]);

        DentistAvailability::create($validated);

        return redirect()->back()->with('success', 'Daily slot created successfully.');
    }

    /**
     * Update an existing daily slot
     */
    public function update(Request $request, DentistAvailability $slot)
    {
        $validated = $request->validate([
            'max_slots'  => 'required|integer|min:1|max:100',
            'start_time' => 'nullable|date_format:H:i',
            'end_time'   => 'nullable|date_format:H:i|after:start_time',
            'is_closed'  => 'boolean',
            'notes'      => 'nullable|string|max:255',
        ]);

        // Optional safety: prevent reducing max_slots below already booked count
        $booked = $slot->bookedCount();
        if ($validated['max_slots'] < $booked) {
            return redirect()->back()->withErrors([
                'max_slots' => "Cannot set max slots lower than already booked ($booked).",
            ]);
        }

        $slot->update($validated);

        return redirect()->back()->with('success', 'Daily slot updated successfully.');
    }

    /**
     * Delete a daily slot
     */
    public function destroy(DentistAvailability $slot)
    {
        // Optional: prevent deleting if there are already bookings
        if ($slot->bookedCount() > 0) {
            return redirect()->back()->withErrors([
                'delete' => 'Cannot delete this day because there are existing appointments.',
            ]);
        }

        $slot->delete();

        return redirect()->back()->with('success', 'Daily slot deleted successfully.');
    }

    /**
     * API-style endpoint: get remaining slots for a specific date
     * (We will use this later on the Landing page)
     */
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->date;

        $slot = DentistAvailability::whereDate('available_date', $date)->first();

        if (!$slot) {
            return response()->json([
                'exists'     => false,
                'message'    => 'No schedule set for this day.',
                'remaining'  => 0,
                'max_slots'  => 0,
                'is_closed'  => true,
            ]);
        }

        return response()->json([
            'exists'     => true,
            'remaining'  => $slot->remainingSlots(),
            'max_slots'  => $slot->max_slots,
            'booked'     => $slot->bookedCount(),
            'is_closed'  => $slot->is_closed,
            'start_time' => $slot->start_time,
            'end_time'   => $slot->end_time,
            'notes'      => $slot->notes,
        ]);
    }
}