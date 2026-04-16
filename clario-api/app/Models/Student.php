<?php

namespace App\Models;

use App\Traits\MultiTenantTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory,MultiTenantTrait;

    protected $table = 'students';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'cin',
        'age',
        'email',
        'phone',
        'address',
        'type',
        'initial_payment',
        'total_price',
        'payment_status',
        'registration_date',
        'parent_name',
        'emergency_contact',
        'photo',
    ];

    protected $casts = [
        'age' => 'integer',
        'initial_payment' => 'decimal:2',
        'total_price' => 'decimal:2',
        'registration_date' => 'date',
    ];
    // Add to Student model
    public function payments()
    {
        return $this->hasMany(Payment::class, 'student_id');
    }

    public function getTotalPaymentsAttribute()
    {
        return $this->payments()->sum('amount_paid');
    }

    public function getOutstandingBalanceAttribute()
    {
        return $this->payments()->sum('amount_remaining');
    }
}
