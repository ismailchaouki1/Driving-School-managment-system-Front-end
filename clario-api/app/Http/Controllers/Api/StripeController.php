<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PendingUser;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Log;

class StripeController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
    }

    /**
     * Step 2: Create Stripe checkout session
     */
    public function createCheckoutSession(Request $request)
    {
        Log::info('=== STRIPE CHECKOUT SESSION STARTED ===');

        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            // Get pending user by email
            $pendingUser = PendingUser::where('email', $request->email)->first();

            if (!$pendingUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pending user not found. Please sign up first.'
                ], 404);
            }

            if ($pendingUser->isExpired()) {
                $pendingUser->delete();
                return response()->json([
                    'success' => false,
                    'message' => 'Registration has expired. Please sign up again.'
                ], 422);
            }

            $plan = $pendingUser->plan_selected;
            $billing = $pendingUser->billing_cycle;

            $prices = [
                'basic' => ['monthly' => 2900, 'yearly' => 8500],
                'pro' => ['monthly' => 5900, 'yearly' => 15000],
                'enterprise' => ['monthly' => 9900, 'yearly' => 21000],
            ];

            $amount = $prices[$plan][$billing];
            $interval = $billing === 'yearly' ? 'year' : 'month';
            $planName = ucfirst($plan);

            $successUrl = env('STRIPE_SUCCESS_URL', 'http://localhost:5173/payment-success')
                . '?session_id={CHECKOUT_SESSION_ID}'
                . '&email=' . urlencode($pendingUser->email);

            $checkoutSession = Session::create([
                'payment_method_types' => ['card'],
                'customer_email' => $pendingUser->email,
                'client_reference_id' => (string)$pendingUser->id,
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => "{$planName} Plan",
                            'description' => "{$planName} plan - {$interval}ly subscription",
                        ],
                        'unit_amount' => $amount,
                        'recurring' => [
                            'interval' => $interval,
                        ],
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'success_url' => $successUrl,
                'cancel_url' => env('STRIPE_CANCEL_URL', 'http://localhost:5173/signup'),
                'metadata' => [
                    'pending_user_id' => $pendingUser->id,
                    'email' => $pendingUser->email,
                    'plan' => $plan,
                    'billing' => $billing,
                ],
            ]);

            // Store session ID in pending user
            $pendingUser->stripe_session_id = $checkoutSession->id;
            $pendingUser->save();

            Log::info('Checkout session created:', ['session_id' => $checkoutSession->id]);

            return response()->json([
                'success' => true,
                'session_id' => $checkoutSession->id,
                'session_url' => $checkoutSession->url,
            ]);

        } catch (\Exception $e) {
            Log::error('Stripe Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function handleWebhook(Request $request)
    {
        // This will be called by Stripe after successful payment
        // You can use this to activate the user if needed
        // But we're activating on the frontend callback

        return response()->json(['status' => 'success']);
    }
}
