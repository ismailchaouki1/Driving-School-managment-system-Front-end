<?php
// app/Models/Subscription.php

namespace App\Models;

use App\Traits\MultiTenantTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory,MultiTenantTrait;

    protected $table = 'subscriptions';

    protected $fillable = [
        'user_id',
        'stripe_id',
        'stripe_status',
        'stripe_price',
        'plan_name',
        'billing_cycle',
        'amount',
        'ends_at',
    ];

    protected $casts = [
        'ends_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isActive()
    {
        return $this->stripe_status === 'active' && (!$this->ends_at || $this->ends_at > now());
    }
}
