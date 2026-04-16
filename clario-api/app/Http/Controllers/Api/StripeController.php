<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    // app/Http/Controllers/Api/StripeController.php

public function createCheckoutSession(Request $request)
{
    Log::info('=== STRIPE CHECKOUT SESSION STARTED ===');

    try {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $request->validate([
            'plan' => 'required|in:basic,pro,enterprise',
            'billing' => 'required|in:monthly,yearly'
        ]);

        $prices = [
            'basic' => ['monthly' => 2900, 'yearly' => 8500],
            'pro' => ['monthly' => 5900, 'yearly' => 15000],
            'enterprise' => ['monthly' => 9900, 'yearly' => 21000],
        ];

        $amount = $prices[$request->plan][$request->billing];
        $interval = $request->billing === 'yearly' ? 'year' : 'month';
        $planName = ucfirst($request->plan);

        // ✅ Add user email and ID to success URL
        $successUrl = env('STRIPE_SUCCESS_URL', 'http://localhost:5173/payment-success')
            . '?session_id={CHECKOUT_SESSION_ID}'
            . '&user_id=' . $user->id
            . '&email=' . urlencode($user->email);

        $checkoutSession = Session::create([
            'payment_method_types' => ['card'],
            'customer_email' => $user->email,
            'client_reference_id' => (string)$user->id,
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => "{$planName} Plan",
                        'description' => "{$planName} plan - {$interval}ly subscription for driving school management",
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
            'cancel_url' => env('STRIPE_CANCEL_URL', 'http://localhost:5173/pricing'),
            'metadata' => [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'plan' => $request->plan,
                'billing' => $request->billing
            ]
        ]);

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

    public function getSubscriptionStatus(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => null
        ]);
    }

    public function cancelSubscription(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Subscription cancelled'
        ]);
    }
    public function handleWebhook(Request $request)
{
    $payload = $request->getContent();
    $sigHeader = $request->header('Stripe-Signature');
    $webhookSecret = env('STRIPE_WEBHOOK_SECRET');

    // If webhook secret is not set, just log and return success (for development)
    if (!$webhookSecret) {
        Log::info('Webhook received but no secret configured:', ['type' => 'dev_mode']);
        return response()->json(['status' => 'success']);
    }

    try {
        $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $webhookSecret);

        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $this->handleCheckoutSessionCompleted($session);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                $subscription = $event->data->object;
                $this->handleSubscriptionUpdated($subscription);
                break;

            case 'customer.subscription.deleted':
                $subscription = $event->data->object;
                $this->handleSubscriptionDeleted($subscription);
                break;
        }

        return response()->json(['status' => 'success']);

    } catch (\Exception $e) {
        Log::error('Webhook error: ' . $e->getMessage());
        return response()->json(['error' => 'Webhook error'], 400);
    }
}

private function handleCheckoutSessionCompleted($session)
{
    $userId = $session->metadata->user_id ?? $session->client_reference_id;
    $plan = $session->metadata->plan ?? 'pro';
    $billing = $session->metadata->billing ?? 'monthly';

    // Get subscription ID from the session
    $subscriptionId = $session->subscription;

    if (!$subscriptionId) {
        Log::error('No subscription ID in checkout session');
        return;
    }

    // Retrieve the full subscription from Stripe
    $stripeSubscription = \Stripe\Subscription::retrieve($subscriptionId);

    // Calculate amount from the subscription (or use metadata)
    $amounts = [
        'basic' => ['monthly' => 29, 'yearly' => 85],
        'pro' => ['monthly' => 59, 'yearly' => 150],
        'enterprise' => ['monthly' => 99, 'yearly' => 210],
    ];
    $amount = $amounts[$plan][$billing];

    // Update or create subscription in your database
    \App\Models\Subscription::updateOrCreate(
        ['stripe_id' => $subscriptionId],
        [
            'user_id' => $userId,
            'stripe_status' => $stripeSubscription->status,
            'stripe_price' => $stripeSubscription->items->data[0]->price->id ?? null,
            'plan_name' => $plan,
            'billing_cycle' => $billing,
            'amount' => $amount,
            'ends_at' => $stripeSubscription->cancel_at_period_end ?
                        \Carbon\Carbon::createFromTimestamp($stripeSubscription->current_period_end) :
                        null,
        ]
    );

    Log::info('Subscription created/updated:', ['user_id' => $userId, 'plan' => $plan]);
}

private function handleSubscriptionUpdated($subscription)
{
    $dbSubscription = \App\Models\Subscription::where('stripe_id', $subscription->id)->first();

    if ($dbSubscription) {
        $dbSubscription->update([
            'stripe_status' => $subscription->status,
            'ends_at' => $subscription->cancel_at_period_end ?
                        \Carbon\Carbon::createFromTimestamp($subscription->current_period_end) :
                        null,
        ]);
    }
}

private function handleSubscriptionDeleted($subscription)
{
    $dbSubscription = \App\Models\Subscription::where('stripe_id', $subscription->id)->first();

    if ($dbSubscription) {
        $dbSubscription->update([
            'stripe_status' => 'canceled',
            'ends_at' => now(),
        ]);
    }
}
}
