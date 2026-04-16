<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\InstructorController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\PaymentController;  // ← ADD THIS
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\StripeController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/login-after-payment', [AuthController::class, 'loginAfterPayment']); // ✅ Add this


Route::post('/password/email', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);
Route::post('/password/verify-token', [PasswordResetController::class, 'verifyToken']);


Route::post('/stripe/webhook', [StripeController::class, 'handleWebhook'])->name('stripe.webhook');


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // ==================== AUTH ROUTES ====================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/preferences', [ProfileController::class, 'updatePreferences']);

    // ==================== STUDENT ROUTES ====================
    Route::apiResource('students', StudentController::class);
    Route::get('/students/export/excel', [StudentController::class, 'exportExcel']);
    Route::get('/students/export/pdf', [StudentController::class, 'exportPdf']);
    Route::get('/students/{student}/receipt', [StudentController::class, 'printReceipt']);

    // ==================== INSTRUCTOR ROUTES ====================
    Route::apiResource('instructors', InstructorController::class);
    Route::get('/instructors/export/excel', [InstructorController::class, 'exportExcel']);
    Route::get('/instructors/export/pdf', [InstructorController::class, 'exportPdf']);

    // ==================== VEHICLE ROUTES ====================
    Route::apiResource('vehicles', VehicleController::class);
    Route::post('/vehicles/{id}/maintenance', [VehicleController::class, 'addMaintenance']);
    Route::post('/vehicles/{id}/documents', [VehicleController::class, 'addDocument']);
    Route::post('/vehicles/{id}/incidents', [VehicleController::class, 'addIncident']);
    Route::get('/vehicles/export/excel', [VehicleController::class, 'exportExcel']);
    Route::get('/vehicles/export/csv', [VehicleController::class, 'exportCsv']);
    Route::get('/vehicles/export/pdf', [VehicleController::class, 'exportPdf']);
    Route::get('/vehicles/{id}/export', [VehicleController::class, 'exportVehiclePdf']);
    // Update maintenance status for all vehicles (can be called by cron job)
    Route::get('/vehicles/update-maintenance-status', [VehicleController::class, 'updateMaintenanceStatus']);

    // Complete maintenance for a specific vehicle
    Route::post('/vehicles/{id}/complete-maintenance', [VehicleController::class, 'completeMaintenance']);
    Route::post('/vehicles/{id}/resolve-incident', [VehicleController::class, 'resolveIncident']);
    // ==================== SESSION ROUTES ====================
    Route::apiResource('sessions', SessionController::class);
    Route::get('/sessions/calendar', [SessionController::class, 'getCalendarSessions']);
    Route::get('/sessions/upcoming', [SessionController::class, 'getUpcoming']);
    Route::get('/sessions/today', [SessionController::class, 'getTodaySessions']);
    Route::get('/sessions/date/{date}', [SessionController::class, 'getByDate']);
    Route::get('/sessions/export/excel', [SessionController::class, 'exportExcel']);
    Route::get('/sessions/export/pdf', [SessionController::class, 'exportPdf']);
    Route::get('/sessions/{session}/receipt', [SessionController::class, 'printReceipt']);
    // Session real-time status routes
    Route::get('/sessions/real-time', [SessionController::class, 'getSessionsWithRealTimeStatus']);
    Route::post('/sessions/update-status', [SessionController::class, 'updateStatusBasedOnTime']);
    Route::post('/sessions/{id}/start', [SessionController::class, 'startSession']);
    Route::post('/sessions/{id}/complete', [SessionController::class, 'completeSession']);

    // ==================== PAYMENT ROUTES ====================
    Route::apiResource('payments', PaymentController::class);
    Route::get('/payments/export/excel', [PaymentController::class, 'exportExcel']);
    Route::get('/payments/export/pdf', [PaymentController::class, 'exportPdf']);
    Route::get('/payments/{id}/receipt', [PaymentController::class, 'exportReceipt']);


    // ==================== STATISTICS ROUTES ====================
     Route::get('/statistics/dashboard', [StatisticsController::class, 'getDashboardStats']);
    Route::get('/statistics/revenue-trends', [StatisticsController::class, 'getRevenueTrends']);
    Route::get('/statistics/session-analytics', [StatisticsController::class, 'getSessionAnalytics']);
    Route::get('/statistics/student-registrations', [StatisticsController::class, 'getStudentRegistrations']);
    Route::get('/statistics/export-excel', [StatisticsController::class, 'exportExcel']);;
    Route::get('/statistics/export-pdf', [StatisticsController::class, 'exportPdf']);



     Route::post('/stripe/create-checkout-session', [StripeController::class, 'createCheckoutSession']);
    Route::post('/stripe/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
    Route::get('/stripe/subscription-status', [StripeController::class, 'getSubscriptionStatus']);
    Route::post('/stripe/cancel-subscription', [StripeController::class, 'cancelSubscription']);


});
