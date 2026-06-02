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
    ];

    public function visitHistories()
    {
        return $this->hasMany(PatientVisitHistory::class);
    }
}
