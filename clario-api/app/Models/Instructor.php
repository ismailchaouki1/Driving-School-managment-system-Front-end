<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\MultiTenantTrait;

class Instructor extends Model
{
    use HasFactory,MultiTenantTrait;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'cin',
        'type',
        'status',
        'experience_level',
        'years_experience',
        'hire_date',
        'specialization',
        'license_number',
        'avatar',
        'students_count',
        'sessions_count',
        'completion_rate',
        'rating',
        'revenue',
        'available_days',
        'available_hours',
        'certifications',
        'schedule',
        'documents',
        'notes',
    ];

    protected $casts = [
        'years_experience' => 'integer',
        'students_count' => 'integer',
        'sessions_count' => 'integer',
        'completion_rate' => 'decimal:2',
        'rating' => 'decimal:2',
        'revenue' => 'decimal:2',
        'available_days' => 'array',
        'available_hours' => 'array',
        'certifications' => 'array',
        'schedule' => 'array',
        'documents' => 'array',
        'hire_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessor for full name
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    // Accessor for revenue per session
    public function getRevenuePerSessionAttribute()
    {
        if ($this->sessions_count <= 0) return 0;
        return round($this->revenue / $this->sessions_count);
    }

    // Relationships
    public function sessions()
    {
        return $this->hasMany(Session::class, 'instructor_id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'assigned_instructor_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%")
              ->orWhere('cin', 'like', "%{$search}%");
        });
    }
}
