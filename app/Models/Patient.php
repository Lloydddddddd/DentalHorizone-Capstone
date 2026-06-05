<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'patient_name',
        'address',
        'telephone',
        'email',
        'age',
        'occupation',
    ];

    // The patients table only stores the basic profile fields currently available in the database.


    public function visitHistories()
    {
        return $this->hasMany(PatientVisitHistory::class);
    }
}
