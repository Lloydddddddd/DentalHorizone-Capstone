<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DentistAvailability extends Model
{
    protected $table = 'dentist_availability';

    protected $fillable = [
        'available_date',
        'max_slots',
        'start_time',
        'end_time',
        'is_closed',
        'notes',
    ];

    protected $casts = [
        'available_date' => 'date',
        'is_closed'      => 'boolean',
        'max_slots'      => 'integer',
    ];

    /**
     * Count how many appointments are already booked on this date.
     * We check both next_appointment and date_of_visit.
     * Cancelled appointments do NOT count.
     */
    public function bookedCount(): int
    {
        $date = $this->available_date instanceof Carbon
            ? $this->available_date->format('Y-m-d')
            : Carbon::parse($this->available_date)->format('Y-m-d');

        return Appointment::query()
            ->where(function ($query) use ($date) {
                $query->whereDate('next_appointment', $date)
                      ->orWhereDate('date_of_visit', $date);
            })
            ->where(function ($query) {
                $query->whereNull('visit_status')
                      ->orWhereNotIn('visit_status', ['cancelled', 'Canceled', 'CANCELLED']);
            })
            ->count();
    }

    /**
     * Remaining available slots for this day
     */
    public function remainingSlots(): int
    {
        if ($this->is_closed) {
            return 0;
        }

        return max(0, $this->max_slots - $this->bookedCount());
    }

    /**
     * Check if the day still has available slots
     */
    public function hasAvailableSlot(): bool
    {
        return $this->remainingSlots() > 0;
    }
}