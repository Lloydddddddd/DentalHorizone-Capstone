<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// The Main Bill Model
class Bill extends Model
{
    protected $fillable = [
        'patient_id', 'appointment_id', 'subtotal', 'discount',
        'total_amount', 'amount_paid', 'balance', 'payment_status', 'billing_date'
    ];

    public function patient() { return $this->belongsTo(Patient::class); }
    public function appointment() { return $this->belongsTo(Appointment::class); }
    public function items() { return $this->hasMany(BillItem::class); }
    public function payments() { return $this->hasMany(Payment::class); }
}

// The Item Model
class BillItem extends Model
{
    protected $fillable = [
        'bill_id', 'service_id', 'quantity', 'unit_price', 'subtotal'
    ];

    public function bill() { return $this->belongsTo(Bill::class); }
    public function service() { return $this->belongsTo(Service::class); }
}

// The Payment Model
class Payment extends Model
{
    protected $fillable = [
        'bill_id', 'amount', 'payment_method', 'payment_date'
    ];

    public function bill() { return $this->belongsTo(Bill::class); }
}