<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait MultiTenantTrait
{
    protected static function bootMultiTenantTrait()
    {
        // Auto-set user_id when creating
        static::creating(function ($model) {
            // Force set user_id from authenticated user
            if (Auth::check()) {
                $model->user_id = Auth::id();
            } elseif (auth()->guard('sanctum')->check()) {
                // For API requests with Sanctum
                $model->user_id = auth()->guard('sanctum')->id();
            } else {
                // If no authenticated user, throw exception or set to null
                throw new \Exception('No authenticated user for creating record');
            }
        });

        // Global scope for queries
        static::addGlobalScope('user', function ($query) {
            if (Auth::check()) {
                $query->where('user_id', Auth::id());
            } elseif (auth()->guard('sanctum')->check()) {
                $query->where('user_id', auth()->guard('sanctum')->id());
            } else {
                // If no authenticated user, return no results
                $query->whereRaw('1 = 0');
            }
        });
    }

    // Add a helper method to check ownership
    public function scopeForUser($query, $userId = null)
    {
        $userId = $userId ?? (Auth::check() ? Auth::id() : null);
        if ($userId) {
            return $query->where('user_id', $userId);
        }
        return $query->whereRaw('1 = 0');
    }
}
