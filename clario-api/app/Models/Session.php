<?php

namespace App\Models;

use App\Traits\MultiTenantTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory,MultiTenantTrait;

    protected $table = 'driving_sessions';

    protected $fillable = [
        'user_id',
        'student_id',
        'student_name',
        'student_category',
        'student_type',
        'student_phone',
        'student_email',
        'instructor_id',
        'instructor_name',
        'type',
        'status',
        'date',
        'start_time',
        'end_time',
        'duration',
        'price',
        'payment_status',
        'vehicle_id',
        'vehicle_plate',
        'location',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'string',
        'end_time' => 'string',
        'price' => 'decimal:2',
        'duration' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessor to ensure time format is correct
    public function getStartTimeAttribute($value)
    {
        return $value ? date('H:i', strtotime($value)) : '09:00';
    }

    public function getEndTimeAttribute($value)
    {
        return $value ? date('H:i', strtotime($value)) : '10:30';
    }

    // Relationships
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class, 'instructor_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now()->toDateString())
                     ->where('status', 'Scheduled');
    }

    public function scopeToday($query)
    {
        return $query->where('date', now()->toDateString());
    }

    public function scopeByDate($query, $date)
    {
        return $query->where('date', $date);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
    // Add to Session model
    public function payments()
    {
        return $this->hasMany(Payment::class, 'session_id');
    }

    public function getPaymentStatusAttribute()
    {
        $totalPaid = $this->payments()->sum('amount_paid');
        if ($totalPaid >= $this->price) return 'Paid';
        if ($totalPaid > 0) return 'Partial';
        return 'Unpaid';
    }
}
