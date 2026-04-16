<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Vehicle;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exports\SessionsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class SessionController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
{
    try {
        // ✅ USE ELOQUENT MODEL
        $sessions = Session::orderBy('date', 'desc')
            ->orderBy('start_time', 'asc')
            ->get();

        $sessions = $sessions->map(function($session) {
            $session->start_time = date('H:i', strtotime($session->start_time));
            $session->end_time = date('H:i', strtotime($session->end_time));
            return $session;
        });

        return response()->json([
            'success' => true,
            'data' => $sessions,
            'message' => 'Sessions retrieved successfully'
        ]);
    } catch (\Exception $e) {
        Log::error('Failed to load sessions: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to load sessions: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    DB::beginTransaction();

    try {
        Log::info('=== SESSION CREATION START ===');
        Log::info('Request data:', $request->all());

        $validated = $request->validate([
            'student_id' => 'nullable|exists:students,id',
            'student_name' => 'required|string|max:255',
            'student_category' => 'required|string|max:10',
            'student_type' => 'required|in:registered,walkin',
            'student_phone' => 'nullable|string|max:20',
            'student_email' => 'nullable|email|max:255',
            'instructor_id' => 'required|exists:instructors,id',
            'instructor_name' => 'required|string|max:255',
            'type' => 'required|in:Code,Driving',
            'status' => 'required|in:Scheduled,In Progress,Completed,Cancelled,No Show',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'duration' => 'required|integer|min:30',
            'price' => 'required|numeric|min:0',
            'payment_status' => 'required|in:Paid,Pending',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'vehicle_plate' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Add user_id automatically
        $validated['user_id'] = $request->user()->id;

        // Format times
        $validated['start_time'] = date('H:i:s', strtotime($validated['start_time']));
        $validated['end_time'] = date('H:i:s', strtotime($validated['end_time']));

        // Create session
        $session = Session::create($validated);
        Log::info('Session created with ID: ' . $session->id);

        // ========== CREATE PAYMENT FOR WALK-IN OR REGISTERED STUDENT WITH PAID STATUS ==========
        $payment = null;

        if ($validated['payment_status'] === 'Paid' && $validated['price'] > 0) {
            Log::info('Creating payment for session...');

            // Generate unique reference with retry logic
            $reference = $this->generateUniquePaymentReference();
            $receiptNumber = 'RCP-SESS-' . str_pad($session->id, 6, '0', STR_PAD_LEFT);

            // Generate CIN for walk-in students
            $cin = $validated['student_type'] === 'walkin'
                ? 'WALKIN-' . date('YmdHis')
                : ($validated['student_phone'] ?? 'WALKIN');

            $paymentData = [
                'reference' => $reference,
                'user_id' => $request->user()->id, // Add user_id to payment
                'session_id' => $session->id,
                'student_id' => $validated['student_id'] ?? null,
                'student_name' => $validated['student_name'],
                'student_cin' => $cin,
                'student_phone' => $validated['student_phone'],
                'student_email' => $validated['student_email'] ?? null,
                'category' => $validated['student_category'],
                'payment_category' => 'session',
                'amount_total' => $validated['price'],
                'amount_paid' => $validated['price'],
                'amount_remaining' => 0,
                'status' => 'Paid',
                'method' => 'Cash',
                'type' => 'Session',
                'date' => $validated['date'],
                'due_date' => $validated['date'],
                'instructor' => $validated['instructor_name'],
                'notes' => 'Payment for ' . $validated['type'] . ' session - ' . ucfirst($validated['student_type']),
                'receipt_number' => $receiptNumber,
                'payment_reference' => 'SESS-' . $session->id,
            ];

            $payment = Payment::create($paymentData);
            Log::info('Payment created successfully:', [
                'payment_id' => $payment->id,
                'reference' => $payment->reference,
                'amount' => $payment->amount_paid
            ]);
        } else {
            Log::info('Payment NOT created. Conditions not met:', [
                'payment_status' => $validated['payment_status'],
                'price' => $validated['price']
            ]);
        }

        // Update instructor stats
        if ($session->instructor_id) {
            $instructor = Instructor::find($session->instructor_id);
            if ($instructor) {
                $instructor->increment('sessions_count');
                if ($payment) {
                    $instructor->increment('revenue', $session->price);
                }

                $completedSessions = Session::where('instructor_id', $instructor->id)
                    ->where('status', 'Completed')
                    ->count();
                $totalSessions = Session::where('instructor_id', $instructor->id)->count();
                $instructor->completion_rate = $totalSessions > 0
                    ? ($completedSessions / $totalSessions) * 100
                    : 0;
                $instructor->save();
            }
        }

        // Update vehicle session count
        if ($session->vehicle_id) {
            $vehicle = Vehicle::find($session->vehicle_id);
            if ($vehicle) {
                $vehicle->increment('sessions_count');
                $vehicle->save();
            }
        }

        DB::commit();

        // Format response times
        $session->start_time = date('H:i', strtotime($session->start_time));
        $session->end_time = date('H:i', strtotime($session->end_time));

        return response()->json([
            'success' => true,
            'message' => 'Session created successfully' . ($payment ? ' with payment record' : ''),
            'data' => $session,
            'payment_created' => $payment ? true : false
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Failed to create session: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString());

        return response()->json([
            'success' => false,
            'message' => 'Failed to create session: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Generate a unique payment reference
     */
    private function generateUniquePaymentReference()
    {
        $year = date('Y');
        $maxAttempts = 10;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            // Get the latest payment ID and add 1
            $lastPayment = Payment::orderBy('id', 'desc')->first();
            $nextNumber = ($lastPayment ? $lastPayment->id + 1 : 1);
            $reference = 'PAY-' . $year . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

            // Check if reference exists
            $exists = Payment::where('reference', $reference)->exists();

            if (!$exists) {
                return $reference;
            }

            // If exists, try with a random number
            $randomRef = 'PAY-' . $year . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
            $exists = Payment::where('reference', $randomRef)->exists();

            if (!$exists) {
                return $randomRef;
            }

            // Last resort: use timestamp
            $timestampRef = 'PAY-' . $year . '-' . date('YmdHis');
            return $timestampRef;
        }

        // Final fallback
        return 'PAY-' . $year . '-' . time();
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $session = Session::findOrFail($id);
            $session->start_time = date('H:i', strtotime($session->start_time));
            $session->end_time = date('H:i', strtotime($session->end_time));

            return response()->json([
                'success' => true,
                'data' => $session
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $session = Session::findOrFail($id);
            $oldPaymentStatus = $session->payment_status;
            $oldPrice = $session->price;

            $validated = $request->validate([
                'student_id' => 'nullable|exists:students,id',
                'student_name' => 'required|string|max:255',
                'student_category' => 'required|string|max:10',
                'student_type' => 'required|in:registered,walkin',
                'student_phone' => 'nullable|string|max:20',
                'student_email' => 'nullable|email|max:255',
                'instructor_id' => 'required|exists:instructors,id',
                'instructor_name' => 'required|string|max:255',
                'type' => 'required|in:Code,Driving',
                'status' => 'required|in:Scheduled,In Progress,Completed,Cancelled,No Show',
                'date' => 'required|date',
                'start_time' => 'required',
                'end_time' => 'required',
                'duration' => 'required|integer|min:30',
                'price' => 'required|numeric|min:0',
                'payment_status' => 'required|in:Paid,Pending',
                'vehicle_id' => 'nullable|exists:vehicles,id',
                'vehicle_plate' => 'nullable|string|max:20',
                'location' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
                'payment_category' => 'session',
                'payment_reference' => 'SESS-' . $session->id,
            ]);

            if (isset($validated['start_time'])) {
                $validated['start_time'] = date('H:i:s', strtotime($validated['start_time']));
            }
            if (isset($validated['end_time'])) {
                $validated['end_time'] = date('H:i:s', strtotime($validated['end_time']));
            }

            $session->update($validated);

            // Update or create payment if payment status changed to Paid
            if ($validated['payment_status'] === 'Paid' && $oldPaymentStatus !== 'Paid' && $validated['price'] > 0) {
                // Check if payment already exists for this session
                $existingPayment = Payment::where('session_id', $session->id)->first();

                if ($existingPayment) {
                    // Update existing payment
                    $existingPayment->update([
                        'amount_total' => $validated['price'],
                        'amount_paid' => $validated['price'],
                        'amount_remaining' => 0,
                        'status' => 'Paid',
                        'date' => $validated['date'],
                        'due_date' => $validated['date'],
                    ]);
                    Log::info('Payment updated for session:', ['payment_id' => $existingPayment->id]);
                } else {
                    // Create new payment
                    $lastPayment = Payment::orderBy('id', 'desc')->first();
                    $nextId = ($lastPayment ? $lastPayment->id + 1 : 1);
                    $reference = 'PAY-' . date('Y') . '-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);

                    $paymentData = [
                        'reference' => $reference,
                        'session_id' => $session->id,
                        'student_id' => $session->student_id,
                        'student_name' => $session->student_name,
                        'student_cin' => $session->student_type === 'walkin'
                            ? 'WALKIN-' . date('Ymd')
                            : ($session->student_cin ?? 'N/A'),
                        'student_phone' => $session->student_phone,
                        'student_email' => $session->student_email,
                        'category' => $session->student_category,
                        'payment_category' => 'session',
                        'amount_total' => $validated['price'],
                        'amount_paid' => $validated['price'],
                        'amount_remaining' => 0,
                        'status' => 'Paid',
                        'method' => 'Cash',
                        'type' => 'Session',
                        'date' => $validated['date'],
                        'due_date' => $validated['date'],
                        'instructor' => $session->instructor_name,
                        'notes' => 'Payment for ' . $session->type . ' session',
                        'receipt_number' => 'RCP-SESS-' . str_pad($session->id, 6, '0', STR_PAD_LEFT),
                    ];

                    $payment = Payment::create($paymentData);
                    Log::info('Payment created for session:', ['payment_id' => $payment->id]);
                }
            }

            // Update instructor stats if needed
            if ($oldPaymentStatus !== $session->payment_status && $session->instructor_id) {
                $instructor = Instructor::find($session->instructor_id);
                if ($instructor) {
                    $completedSessions = Session::where('instructor_id', $instructor->id)
                        ->where('status', 'Completed')
                        ->count();
                    $totalSessions = Session::where('instructor_id', $instructor->id)->count();
                    $instructor->completion_rate = $totalSessions > 0
                        ? ($completedSessions / $totalSessions) * 100
                        : 0;
                    $instructor->save();
                }
            }

            DB::commit();

            $session->start_time = date('H:i', strtotime($session->start_time));
            $session->end_time = date('H:i', strtotime($session->end_time));

            return response()->json([
                'success' => true,
                'message' => 'Session updated successfully',
                'data' => $session
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update session: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $session = Session::findOrFail($id);

            // Delete associated payment if exists
            Payment::where('session_id', $id)->delete();

            // Decrement instructor stats
            if ($session->instructor_id) {
                $instructor = Instructor::find($session->instructor_id);
                if ($instructor) {
                    $instructor->decrement('sessions_count');
                    $instructor->decrement('revenue', $session->price);
                    $completedSessions = Session::where('instructor_id', $instructor->id)
                        ->where('status', 'Completed')
                        ->count();
                    $totalSessions = Session::where('instructor_id', $instructor->id)->count();
                    $instructor->completion_rate = $totalSessions > 0
                        ? ($completedSessions / $totalSessions) * 100
                        : 0;
                    $instructor->save();
                }
            }

            // Decrement vehicle session count
            if ($session->vehicle_id) {
                $vehicle = Vehicle::find($session->vehicle_id);
                if ($vehicle) {
                    $vehicle->decrement('sessions_count');
                    $vehicle->save();
                }
            }

            $session->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Session deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete session: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get calendar sessions (for month view)
     */
    public function getCalendarSessions(Request $request)
{
    try {
        // ✅ USE ELOQUENT MODEL
        $query = Session::query();

        if ($request->has('month') && $request->has('year')) {
            $query->whereMonth('date', $request->month)
                  ->whereYear('date', $request->year);
        }

        if ($request->has('start_date') && $request->start_date) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->where('date', '<=', $request->end_date);
        }

        if ($request->has('type') && $request->type !== 'All') {
            $query->where('type', $request->type);
        }

        if ($request->has('instructor_id') && $request->instructor_id !== 'All') {
            $query->where('instructor_id', $request->instructor_id);
        }

        $sessions = $query->orderBy('date', 'asc')
                         ->orderBy('start_time', 'asc')
                         ->get();

        $sessions = $sessions->map(function($session) {
            $session->start_time = date('H:i', strtotime($session->start_time));
            $session->end_time = date('H:i', strtotime($session->end_time));
            return $session;
        });

        return response()->json([
            'success' => true,
            'data' => $sessions
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to load calendar: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Get upcoming sessions
     */
    public function getUpcoming()
    {
        try {
            $sessions = Session::where('date', '>=', now()->toDateString())
                ->where('status', 'Scheduled')
                ->orderBy('date', 'asc')
                ->orderBy('start_time', 'asc')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $sessions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load upcoming sessions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get today's sessions
     */
    public function getTodaySessions()
    {
        try {
            $sessions = Session::where('date', now()->toDateString())
                ->orderBy('start_time', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $sessions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load today\'s sessions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sessions by date
     */
    public function getByDate($date)
    {
        try {
            $sessions = Session::where('date', $date)
                ->orderBy('start_time', 'asc')
                ->get();

            $sessions = $sessions->map(function($session) {
                $session->start_time = date('H:i', strtotime($session->start_time));
                $session->end_time = date('H:i', strtotime($session->end_time));
                return $session;
            });

            return response()->json([
                'success' => true,
                'data' => $sessions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load sessions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export sessions to Excel
     */
    public function exportExcel(Request $request)
    {
        try {
            $query = Session::query();

            if ($request->has('type') && $request->type !== 'All') {
                $query->where('type', $request->type);
            }

            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('instructor_id') && $request->instructor_id !== 'All') {
                $query->where('instructor_id', $request->instructor_id);
            }

            if ($request->has('start_date') && !empty($request->start_date)) {
                $query->where('date', '>=', $request->start_date);
            }

            if ($request->has('end_date') && !empty($request->end_date)) {
                $query->where('date', '<=', $request->end_date);
            }

            $sessions = $query->get();
            $export = new SessionsExport($sessions);
            $filename = 'sessions_' . date('Y-m-d_His') . '.xlsx';

            return Excel::download($export, $filename);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export sessions to PDF
     */
    public function exportPdf(Request $request)
    {
        try {
            $query = Session::query();

            if ($request->has('type') && $request->type !== 'All') {
                $query->where('type', $request->type);
            }

            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('instructor_id') && $request->instructor_id !== 'All') {
                $query->where('instructor_id', $request->instructor_id);
            }

            if ($request->has('start_date') && !empty($request->start_date)) {
                $query->where('date', '>=', $request->start_date);
            }

            if ($request->has('end_date') && !empty($request->end_date)) {
                $query->where('date', '<=', $request->end_date);
            }

            $sessions = $query->get();
            $totalRevenue = $sessions->sum('price');
            $completedSessions = $sessions->where('status', 'Completed')->count();

            $pdf = Pdf::loadView('exports.sessions-pdf', [
                'sessions' => $sessions,
                'totalRevenue' => $totalRevenue,
                'completedSessions' => $completedSessions,
                'exportDate' => now()->format('Y-m-d H:i:s')
            ]);

            $pdf->setPaper('A4', 'landscape');

            return $pdf->download('sessions_' . date('Y-m-d_His') . '.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Print session receipt
     */
    public function printReceipt($id)
    {
        try {
            $session = Session::findOrFail($id);

            $pdf = Pdf::loadView('exports.session-receipt', ['session' => $session]);
            $pdf->setPaper('A4', 'portrait');

            return $pdf->download('session_receipt_' . $session->id . '_' . date('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Receipt generation failed: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Update session status based on current time
     */
    public function updateStatusBasedOnTime()
    {
        try {
            $currentTime = now();
            $currentDate = $currentTime->toDateString();
            $currentTimeString = $currentTime->format('H:i:s');

            // Get all sessions that are scheduled or in progress
            $sessions = Session::whereIn('status', ['Scheduled', 'In Progress'])
                ->where('date', '<=', $currentDate)
                ->get();

            $updatedCount = 0;

            foreach ($sessions as $session) {
                $sessionDate = $session->date;
                $sessionEndTime = $session->end_time;
                $sessionStartTime = $session->start_time;

                // If session date is in the past, mark as completed
                if ($sessionDate < $currentDate) {
                    if ($session->status !== 'Completed') {
                        $session->status = 'Completed';
                        $session->save();
                        $updatedCount++;
                    }
                    continue;
                }

                // If session is today
                if ($sessionDate == $currentDate) {
                    // If end time has passed, mark as completed
                    if ($sessionEndTime <= $currentTimeString) {
                        if ($session->status !== 'Completed') {
                            $session->status = 'Completed';
                            $session->save();
                            $updatedCount++;
                        }
                    }
                    // If start time has passed but not end time, mark as in progress
                    elseif ($sessionStartTime <= $currentTimeString && $sessionEndTime > $currentTimeString) {
                        if ($session->status !== 'In Progress') {
                            $session->status = 'In Progress';
                            $session->save();
                            $updatedCount++;
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Updated {$updatedCount} sessions",
                'updated_count' => $updatedCount
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update session status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update session status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sessions with real-time status
     */
    public function getSessionsWithRealTimeStatus()
{
    try {
        // First update statuses based on current time
        $this->updateStatusBasedOnTime();

        // ✅ USE ELOQUENT MODEL
        $sessions = Session::orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        $sessions = $sessions->map(function($session) {
            $session->start_time = date('H:i', strtotime($session->start_time));
            $session->end_time = date('H:i', strtotime($session->end_time));
            return $session;
        });

        return response()->json([
            'success' => true,
            'data' => $sessions,
            'current_time' => now()->format('Y-m-d H:i:s')
        ]);
    } catch (\Exception $e) {
        Log::error('Failed to load sessions: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to load sessions: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Manually complete a session
     */
    public function completeSession($id)
    {
        try {
            $session = Session::findOrFail($id);

            // Check if session can be completed
            if ($session->status === 'Completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Session is already completed'
                ], 400);
            }

            if ($session->status === 'Cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cancelled sessions cannot be completed'
                ], 400);
            }

            // Update session status
            $session->status = 'Completed';
            $session->save();

            // Update instructor stats
            if ($session->instructor_id) {
                $instructor = Instructor::find($session->instructor_id);
                if ($instructor) {
                    $completedSessions = Session::where('instructor_id', $instructor->id)
                        ->where('status', 'Completed')
                        ->count();
                    $totalSessions = Session::where('instructor_id', $instructor->id)->count();
                    $instructor->completion_rate = $totalSessions > 0
                        ? ($completedSessions / $totalSessions) * 100
                        : 0;
                    $instructor->save();
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Session marked as completed',
                'data' => $session
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to complete session: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Start a session (mark as In Progress)
     */
    public function startSession($id)
    {
        try {
            $session = Session::findOrFail($id);

            if ($session->status !== 'Scheduled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only scheduled sessions can be started'
                ], 400);
            }

            $session->status = 'In Progress';
            $session->save();

            return response()->json([
                'success' => true,
                'message' => 'Session started',
                'data' => $session
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to start session: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to start session: ' . $e->getMessage()
            ], 500);
        }
    }
}
