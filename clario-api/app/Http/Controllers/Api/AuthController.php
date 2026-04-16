<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PendingUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Step 1: Create pending user and return checkout info
     */
    public function signup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'plan' => 'required|in:basic,pro,enterprise',
            'billing' => 'required|in:monthly,yearly',
        ]);

        // Delete any expired pending users
        PendingUser::where('expires_at', '<', now())->delete();

        // Check if email already exists in pending users
        $existingPending = PendingUser::where('email', $request->email)->first();

        if ($existingPending) {
            // If not expired, return existing pending user
            if (!$existingPending->isExpired()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Continuing with existing pending registration.',
                    'data' => [
                        'pending_user_id' => $existingPending->id,
                        'email' => $existingPending->email,
                        'plan' => $existingPending->plan_selected,
                        'billing' => $existingPending->billing_cycle,
                    ]
                ], 200);
            }
            // If expired, delete it
            $existingPending->delete();
        }

        // Create new pending user
        $pendingUser = PendingUser::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'stripe_session_id' => null,
            'plan_selected' => $request->plan,
            'billing_cycle' => $request->billing,
            'expires_at' => now()->addHours(24),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Please complete payment to activate your account.',
            'data' => [
                'pending_user_id' => $pendingUser->id,
                'email' => $pendingUser->email,
                'plan' => $pendingUser->plan_selected,
                'billing' => $pendingUser->billing_cycle,
            ]
        ], 201);
    }

    /**
     * Step 3: Activate user after successful payment and auto login
     */
    public function activateAndLogin(Request $request)
{
    $request->validate([
        'session_id' => 'required|string',
        'email' => 'required|email',
    ]);

    // First, check if user already exists (payment webhook might have created it)
    $user = User::where('email', $request->email)->first();

    if ($user) {
        // User already exists, just login
        $token = $user->createToken('auth_token')->plainTextToken;

        // Delete pending user if exists
        PendingUser::where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account already activated. Logging in.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token' => $token,
            ]
        ]);
    }

    // Find pending user
    $pendingUser = PendingUser::where('email', $request->email)
        ->where('stripe_session_id', $request->session_id)
        ->first();

    if (!$pendingUser) {
        return response()->json([
            'success' => false,
            'message' => 'Pending user not found. Please contact support.'
        ], 404);
    }

    if ($pendingUser->isExpired()) {
        $pendingUser->delete();
        return response()->json([
            'success' => false,
            'message' => 'Registration has expired. Please sign up again.'
        ], 422);
    }

    // Create actual user
    $user = User::create([
        'name' => $pendingUser->name,
        'email' => $pendingUser->email,
        'password' => $pendingUser->password,
        'role' => 'user',
    ]);

    // Create token for auto-login
    $token = $user->createToken('auth_token')->plainTextToken;

    // Delete pending user
    $pendingUser->delete();

    return response()->json([
        'success' => true,
        'message' => 'Account activated successfully!',
        'data' => [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
        ]
    ]);
}

    /**
     * Regular login for existing users
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Check if there's a pending user
            $pendingUser = PendingUser::where('email', $request->email)->first();
            if ($pendingUser && !$pendingUser->isExpired()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please complete your payment to activate your account.',
                    'pending' => true,
                    'email' => $pendingUser->email,
                ], 403);
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token' => $token,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                ]
            ]
        ]);
    }
}
