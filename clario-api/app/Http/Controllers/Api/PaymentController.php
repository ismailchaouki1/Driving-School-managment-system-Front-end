<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Exports\PaymentsExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function index()
    {
        try {
            // Use Eloquent instead of DB facade to get proper collections
            $payments = Payment::orderBy('date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            // Calculate statistics including vehicle expenses
            $totalRevenue = Payment::revenue()->sum('amount_paid');
            $totalExpenses = Payment::vehicleExpenses()->sum('amount_paid');
            $netRevenue = $totalRevenue - $totalExpenses;

            Log::info('Payments retrieved: ' . $payments->count());

            return response()->json([
                'success' => true,
                'data' => $payments,
                'message' => 'Payments retrieved successfully',
                'count' => $payments->count(),
                'summary' => [
                    'total_revenue' => $totalRevenue,
                    'total_expenses' => $totalExpenses,
                    'net_revenue' => $netRevenue,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load payments: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load payments: ' . $e->getMessage()
            ], 500);
        }
    }


    // Add a new endpoint for expense statistics
    public function getExpenseStats()
    {
        try {
            $maintenanceExpenses = Payment::where('payment_category', 'vehicle_maintenance')
                ->select(DB::raw('SUM(amount_paid) as total, COUNT(*) as count, type'))
                ->groupBy('type')
                ->get();

            $incidentExpenses = Payment::where('payment_category', 'vehicle_incident')
                ->select(DB::raw('SUM(amount_paid) as total, COUNT(*) as count, type'))
                ->groupBy('type')
                ->get();

            $monthlyExpenses = Payment::whereIn('payment_category', ['vehicle_maintenance', 'vehicle_incident'])
                ->select(DB::raw('SUM(amount_paid) as total, DATE_FORMAT(date, "%Y-%m") as month'))
                ->groupBy('month')
                ->orderBy('month', 'desc')
                ->limit(12)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'maintenance_expenses' => $maintenanceExpenses,
                    'incident_expenses' => $incidentExpenses,
                    'monthly_expenses' => $monthlyExpenses,
                    'total_maintenance' => $maintenanceExpenses->sum('total'),
                    'total_incidents' => $incidentExpenses->sum('total'),
                    'total_expenses' => $maintenanceExpenses->sum('total') + $incidentExpenses->sum('total'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get expense stats: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    try {
        $data = $request->all();

        // Add user_id automatically
        $data['user_id'] = $request->user()->id;

        if (!isset($data['method']) || empty($data['method'])) {
            $data['method'] = 'Cash';
        }

        // Auto-calculate remaining
        $data['amount_remaining'] = $data['amount_total'] - $data['amount_paid'];

        // Auto-set status
        if ($data['amount_paid'] >= $data['amount_total']) {
            $data['status'] = 'Paid';
        } elseif ($data['amount_paid'] > 0) {
            $data['status'] = 'Partial';
        } else {
            $data['status'] = 'Pending';
        }

        $payment = Payment::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Payment created successfully',
            'data' => $payment
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create payment: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $payment = Payment::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $payment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $payment = Payment::findOrFail($id);

            $data = $request->all();

            if (isset($data['amount_total']) || isset($data['amount_paid'])) {
                $total = $data['amount_total'] ?? $payment->amount_total;
                $paid = $data['amount_paid'] ?? $payment->amount_paid;
                $data['amount_remaining'] = $total - $paid;

                if ($paid >= $total) {
                    $data['status'] = 'Paid';
                } elseif ($paid > 0) {
                    $data['status'] = 'Partial';
                } else {
                    $data['status'] = 'Pending';
                }
            }

            $payment->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Payment updated successfully',
                'data' => $payment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $payment = Payment::findOrFail($id);
            $payment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export payments to Excel
     */
    public function exportExcel(Request $request)
    {
        try {
            $query = Payment::query();

            // Apply filters if provided
            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('method') && $request->method !== 'All') {
                $query->where('method', $request->method);
            }

            if ($request->has('type') && $request->type !== 'All') {
                $query->where('type', $request->type);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('student_name', 'like', "%{$search}%")
                      ->orWhere('student_cin', 'like', "%{$search}%")
                      ->orWhere('reference', 'like', "%{$search}%")
                      ->orWhere('instructor', 'like', "%{$search}%");
                });
            }

            $payments = $query->orderBy('date', 'desc')->get();
            $export = new PaymentsExport($payments);

            return Excel::download($export, 'payments_' . date('Y-m-d_His') . '.xlsx');
        } catch (\Exception $e) {
            Log::error('Excel export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export payments to PDF
     */
    public function exportPdf(Request $request)
    {
        try {
            $query = Payment::query();

            // Apply filters if provided
            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('method') && $request->method !== 'All') {
                $query->where('method', $request->method);
            }

            if ($request->has('type') && $request->type !== 'All') {
                $query->where('type', $request->type);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('student_name', 'like', "%{$search}%")
                      ->orWhere('student_cin', 'like', "%{$search}%")
                      ->orWhere('reference', 'like', "%{$search}%")
                      ->orWhere('instructor', 'like', "%{$search}%");
                });
            }

            $payments = $query->orderBy('date', 'desc')->get();

            // Calculate statistics
            $totalRevenue = $payments->sum('amount_paid');
            $totalPending = $payments->sum('amount_remaining');
            $paidCount = $payments->where('status', 'Paid')->count();
            $partialCount = $payments->where('status', 'Partial')->count();
            $pendingCount = $payments->where('status', 'Pending')->count();
            $overdueCount = $payments->where('status', 'Overdue')->count();

            $pdf = Pdf::loadView('exports.payments-pdf', [
                'payments' => $payments,
                'totalRevenue' => $totalRevenue,
                'totalPending' => $totalPending,
                'paidCount' => $paidCount,
                'partialCount' => $partialCount,
                'pendingCount' => $pendingCount,
                'overdueCount' => $overdueCount,
                'exportDate' => now()->format('Y-m-d H:i:s')
            ]);

            $pdf->setPaper('A4', 'landscape');

            return $pdf->download('payments_' . date('Y-m-d_His') . '.pdf');
        } catch (\Exception $e) {
            Log::error('PDF export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export single payment receipt as PDF
     */
    public function exportReceipt($id)
    {
        try {
            $payment = Payment::findOrFail($id);

            $pdf = Pdf::loadView('exports.payment-receipt', [
                'payment' => $payment
            ]);

            $pdf->setPaper('A4', 'portrait');

            return $pdf->download('receipt_' . $payment->reference . '_' . date('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            Log::error('Receipt export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Receipt generation failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
