<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArchivedPatient extends Model
{
    protected $fillable = [
        'patient_name',
        'address',
        'telephone',
        'age',
        'occupation',
        'complaint',
        'date_of_visit',
        'next_appointment',
        'service',
        'patient_status',
        'visit_status',
        'status',
        'debit',
        'credit',
        'email',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
