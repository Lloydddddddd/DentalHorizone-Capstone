<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'complaint',
        'service',
        'date_of_visit',
        'next_appointment',
        'visit_status',
        'debit',
        'credit',
        'balance',
    ];

    protected $casts = [
        'date_of_visit' => 'datetime',
        'next_appointment' => 'datetime',
    ];

    public function getDateOfVisitAttribute($value)
    {
        return $value 
            ? \Carbon\Carbon::parse($value)
                ->timezone('Asia/Manila')
                ->format('M d, Y h:i A') 
            : null;
    }

    public function getNextAppointmentAttribute($value)
    {
        return $value 
            ? \Carbon\Carbon::parse($value)
                ->timezone('Asia/Manila')
                ->format('M d, Y h:i A') 
            : null;
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
