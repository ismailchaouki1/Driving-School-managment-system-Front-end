<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    // Add these relationships
public function subscription()
{
    return $this->hasOne(Subscription::class)->latest();
}

public function hasActiveSubscription()
{
    return $this->subscription &&
           $this->subscription->stripe_status === 'active' &&
           (!$this->subscription->ends_at || $this->subscription->ends_at > now());
}
}
