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

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
