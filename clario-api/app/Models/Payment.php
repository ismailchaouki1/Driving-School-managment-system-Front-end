<?php

namespace App\Models;

use App\Traits\MultiTenantTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory,MultiTenantTrait;

    protected $fillable = [
        'user_id',
        'reference',
        'student_id',
        'session_id',
        'vehicle_id',
        'student_name',
        'student_cin',
        'student_phone',
        'student_email',
        'category',
        'payment_category',
        'amount_total',
        'amount_paid',
        'amount_remaining',
        'status',
        'method',
        'type',
        'date',
        'due_date',
        'instructor',
        'notes',
        'receipt_number',
        'payment_reference',
    ];

    protected $casts = [
        'amount_total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'amount_remaining' => 'decimal:2',
        'date' => 'date',
        'due_date' => 'date',
    ];

    const PAYMENT_CATEGORIES = [
        'registration' => 'Registration',
        'session' => 'Session',
        'exam' => 'Exam',
        'vehicle_maintenance' => 'Vehicle Maintenance',
        'vehicle_incident' => 'Vehicle Incident',
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function session()
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    // Scopes for expenses
    public function scopeVehicleExpenses($query)
    {
        return $query->whereIn('payment_category', ['vehicle_maintenance', 'vehicle_incident']);
    }

    public function scopeMaintenanceExpenses($query)
    {
        return $query->where('payment_category', 'vehicle_maintenance');
    }

    public function scopeIncidentExpenses($query)
    {
        return $query->where('payment_category', 'vehicle_incident');
    }

    public function scopeRevenue($query)
    {
        return $query->whereIn('payment_category', ['registration', 'session', 'exam']);
    }

    // Accessor for net revenue (revenue - expenses)
    public function getNetRevenueAttribute()
    {
        $totalRevenue = self::revenue()->sum('amount_paid');
        $totalExpenses = self::vehicleExpenses()->sum('amount_paid');
        return $totalRevenue - $totalExpenses;
    }

    // Accessor to check if payment is an expense
    public function getIsExpenseAttribute()
    {
        return in_array($this->payment_category, ['vehicle_maintenance', 'vehicle_incident']);
    }
}
