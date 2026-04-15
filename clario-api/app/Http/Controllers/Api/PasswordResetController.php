<?php
// app/Http/Controllers/Api/PasswordResetController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link to email
     */
    public function sendResetLink(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email'
            ], [
                'email.exists' => 'We cannot find a user with that email address.'
            ]);

            $user = User::where('email', $request->email)->first();

            // Check if user exists and has email
            if (!$user || !$user->email) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found or email is invalid.'
                ], 404);
            }

            // Generate token
            $token = Str::random(64);

            // Delete old tokens
            DB::table('password_reset_tokens')->where('email', $user->email)->delete();

            // Store token
            DB::table('password_reset_tokens')->insert([
                'email' => $user->email,
                'token' => Hash::make($token),
                'created_at' => now(),
            ]);

            // Send email
            try {
                $this->sendResetEmail($user->email, $token, $user->name);
            } catch (\Exception $mailError) {
                Log::error('Mail sending failed: ' . $mailError->getMessage());

                // For development, return the reset link directly
                if (env('APP_ENV') === 'local') {
                    $resetLink = env('FRONTEND_URL', 'http://localhost:5173') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
                    return response()->json([
                        'success' => true,
                        'message' => 'Reset link generated. Use this link: ' . $resetLink,
                        'dev_reset_link' => $resetLink
                    ]);
                }

                return response()->json([
                    'success' => false,
                    'message' => 'Unable to send email. Please check your mail configuration.'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'We have emailed your password reset link!'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to send reset link: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send reset link: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send reset email
     */
    private function sendResetEmail($email, $token, $name)
    {
        // Validate email
        if (empty($email)) {
            throw new \Exception('Email address is required');
        }

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $resetUrl = $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($email);

        $data = [
            'name' => $name ?? 'User',
            'reset_url' => $resetUrl,
            'email' => $email,
            'token' => $token,
            'year' => date('Y')
        ];

        Mail::send('emails.password-reset', $data, function ($message) use ($email, $name) {
            $message->to($email, $name ?? 'User')
                    ->subject('Reset Your Password - Clario Driving School')
                    ->from(env('MAIL_FROM_ADDRESS', 'noreply@clario.com'), env('MAIL_FROM_NAME', 'Clario Driving School'));
        });
    }

    /**
     * Verify reset token
     */
    public function verifyToken(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'token' => 'required',
            ]);

            $resetRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid reset token.'
                ], 400);
            }

            // Check if token is expired (60 minutes)
            $tokenCreatedAt = strtotime($resetRecord->created_at);
            $tokenExpiresAt = $tokenCreatedAt + 3600;

            if (time() > $tokenExpiresAt) {
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                return response()->json([
                    'success' => false,
                    'message' => 'Reset token has expired.'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Token is valid.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify token: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'token' => 'required',
                'password' => 'required|string|min:6|confirmed',
            ]);

            // Verify token
            $resetRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired reset token.'
                ], 400);
            }

            // Check if token is expired (60 minutes)
            $tokenCreatedAt = strtotime($resetRecord->created_at);
            $tokenExpiresAt = $tokenCreatedAt + 3600;

            if (time() > $tokenExpiresAt) {
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                return response()->json([
                    'success' => false,
                    'message' => 'Reset token has expired. Please request a new one.'
                ], 400);
            }

            // Update password
            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            // Delete token
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Password has been reset successfully!'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset password: ' . $e->getMessage()
            ], 500);
        }
    }
}
