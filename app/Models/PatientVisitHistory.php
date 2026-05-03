<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientVisitHistory extends Model
{
    protected $fillable = [
        'patient_id',
        'user_id',
        'service',
        'service_date',
        'debit',
        'credit',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
