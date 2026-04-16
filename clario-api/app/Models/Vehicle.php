<?php

namespace App\Models;

use App\Traits\MultiTenantTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory,MultiTenantTrait;

    protected $fillable = [
        'user_id',
        'brand',
        'model',
        'year',
        'plate',
        'vin',
        'category',
        'fuel',
        'transmission',
        'color',
        'status',
        'mileage',
        'last_maintenance',
        'next_maintenance',
        'insurance_expiry',
        'insurance_provider',
        'insurance_policy',
        'technical_inspection',
        'registration_expiry',
        'assigned_instructor',
        'sessions_count',
        'purchase_price',
        'current_value',
        'fuel_efficiency',
        'notes',
        'maintenance_history',
        'documents',
        'incidents',
    ];

    protected $casts = [

        'year' => 'integer',
        'mileage' => 'integer',
        'sessions_count' => 'integer',
        'purchase_price' => 'decimal:2',
        'current_value' => 'decimal:2',
        'fuel_efficiency' => 'decimal:2',
        'last_maintenance' => 'date',
        'next_maintenance' => 'date',
        'insurance_expiry' => 'date',
        'technical_inspection' => 'date',
        'registration_expiry' => 'date',
        'maintenance_history' => 'array',
        'documents' => 'array',
        'incidents' => 'array',
    ];

    // Accessor for full vehicle name
    public function getFullNameAttribute()
    {
        return "{$this->brand} {$this->model} ({$this->plate})";
    }

    // Accessor for utilization percentage
    public function getUtilizationPercentageAttribute()
    {
        $maxSessionsPerYear = 300;
        $utilization = ($this->sessions_count / $maxSessionsPerYear) * 100;
        return min(100, round($utilization));
    }

    // Relationships
    public function sessions()
    {
        return $this->hasMany(Session::class, 'vehicle_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeNeedsMaintenance($query)
    {
        return $query->where('next_maintenance', '<=', now()->addDays(30));
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('brand', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%")
              ->orWhere('plate', 'like', "%{$search}%")
              ->orWhere('vin', 'like', "%{$search}%");
        });
    }
    // Add to Vehicle model
    public function payments()
    {
        return $this->hasMany(Payment::class, 'vehicle_id');
    }

    public function getMaintenanceCostAttribute()
    {
        return $this->payments()
            ->where('payment_category', 'vehicle_maintenance')
            ->sum('amount_paid');
    }
}
