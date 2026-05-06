<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'patient_name',
        'address',
        'telephone',
        'age',
        'occupation',
        'email',
        'complaint',
        'date_of_visit',
        'next_appointment',
        'service',
        'visit_status',
        'status',
        'patient_status',
        'debit',
        'credit',
        'balance',
    ];

    public function visitHistories()
    {
        return $this->hasMany(PatientVisitHistory::class);
    }
}
