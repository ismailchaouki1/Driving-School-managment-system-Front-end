<?php
// app/Http/Controllers/Api/StatisticsController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Vehicle;
use App\Models\Session;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\StatisticsExport;

class StatisticsController extends Controller
{
    /**
     * Get all statistics data for dashboard with filters
     */
    public function getDashboardStats(Request $request)
    {
        try {
            $dateRange = $request->get('date_range', 'year');
            $filterType = $request->get('filter_type', 'All');
            $filterCategory = $request->get('filter_category', 'All');

            $currentYear = now()->year;
            $currentMonth = now()->month;

            // Get date range filters
            $dateFilter = $this->getDateFilter($dateRange);

            // Fetch all data
            $students = Student::all();
            $instructors = Instructor::all();
            $vehicles = Vehicle::all();

            // Filter sessions by date range and type
            $sessions = Session::when($dateFilter, function($query) use ($dateFilter) {
                return $query->whereBetween('date', $dateFilter);
            })->when($filterType !== 'All', function($query) use ($filterType) {
                return $query->where('type', $filterType);
            })->get();

            // Filter payments by date range and category
            $payments = Payment::when($dateFilter, function($query) use ($dateFilter) {
                return $query->whereBetween('date', $dateFilter);
            })->when($filterCategory !== 'All', function($query) use ($filterCategory) {
                return $query->where('type', $filterCategory);
            })->get();

            // Calculate KPIs
            $kpis = $this->calculateKPIs($students, $sessions, $payments, $currentMonth, $currentYear);

            // Calculate quick stats
            $quickStats = $this->calculateQuickStats($students, $instructors, $sessions);

            // Get revenue data by month (Registration, Session, Exam)
            $revenueData = $this->getRevenueByMonth($payments, $currentYear);

            // Get expenses data by month (Maintenance, Incident)
            $expensesData = $this->getExpensesByMonth($payments, $currentYear);

            // Get student registrations by month
            $registrationsData = $this->getRegistrationsByMonth($students, $currentYear);

            // Get session analytics
            $sessionData = $this->getSessionAnalyticsData($sessions, $currentYear);

            // Get payment methods distribution
            $paymentMethods = $this->getPaymentMethodsDistribution($payments);

            // Get category distribution
            $categoryDistribution = $this->getCategoryDistribution($students);

            // Get top instructors with session type filter
            $topInstructors = $this->getTopInstructors($instructors, $filterType);

            // Get recent transactions with payment category filter
            $recentTransactions = $this->getRecentTransactions($payments);

            // Get vehicle utilization
            $vehicleUtilization = $this->getVehicleUtilization($vehicles);

            return response()->json([
                'success' => true,
                'data' => [
                    'kpis' => $kpis,
                    'quick_stats' => $quickStats,
                    'revenue_data' => $revenueData,
                    'expenses_data' => $expensesData,
                    'registrations_data' => $registrationsData,
                    'session_data' => $sessionData,
                    'payment_methods' => $paymentMethods,
                    'category_distribution' => $categoryDistribution,
                    'top_instructors' => $topInstructors,
                    'recent_transactions' => $recentTransactions,
                    'vehicle_utilization' => $vehicleUtilization,
                    'applied_filters' => [
                        'date_range' => $dateRange,
                        'session_type' => $filterType,
                        'payment_category' => $filterCategory,
                    ]
                ],
                'message' => 'Statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get statistics: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get expenses data by month (Maintenance & Incident)
     */
    private function getExpensesByMonth($payments, $currentYear)
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $maintenanceExpenses = array_fill(0, 12, 0);
        $incidentExpenses = array_fill(0, 12, 0);

        foreach ($payments as $payment) {
            $date = date('n', strtotime($payment->date));
            $year = date('Y', strtotime($payment->date));
            $month = (int)$date - 1;
            $amount = (float)$payment->amount_paid;

            if ($year == $currentYear) {
                if ($payment->type === 'Maintenance') {
                    $maintenanceExpenses[$month] += $amount;
                } elseif ($payment->type === 'Incident') {
                    $incidentExpenses[$month] += $amount;
                }
            }
        }

        $datasets = [];

        // Add maintenance expenses dataset if any
        if (array_sum($maintenanceExpenses) > 0) {
            $datasets[] = [
                'name' => 'Maintenance',
                'data' => $maintenanceExpenses,
                'color' => '#f59e0b'
            ];
        }

        // Add incident expenses dataset if any
        if (array_sum($incidentExpenses) > 0) {
            $datasets[] = [
                'name' => 'Incidents',
                'data' => $incidentExpenses,
                'color' => '#ef4444'
            ];
        }

        return [
            'labels' => $months,
            'datasets' => $datasets
        ];
    }

    /**
     * Get revenue trends data
     */
    public function getRevenueTrends(Request $request)
    {
        try {
            $year = $request->get('year', now()->year);
            $type = $request->get('type', 'all');
            $filterCategory = $request->get('filter_category', 'All');

            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $revenueData = [
                'registration' => array_fill(0, 12, 0),
                'session' => array_fill(0, 12, 0),
                'exam' => array_fill(0, 12, 0),
            ];

            $query = Payment::whereYear('date', $year);

            if ($filterCategory !== 'All') {
                $query->where('type', $filterCategory);
            }

            $payments = $query->get();

            foreach ($payments as $payment) {
                $month = (int)date('n', strtotime($payment->date)) - 1;
                $amount = (float)$payment->amount_paid;

                if ($type === 'all' || $type === 'registration') {
                    if ($payment->type === 'Registration') {
                        $revenueData['registration'][$month] += $amount;
                    }
                }
                if ($type === 'all' || $type === 'session') {
                    if ($payment->type === 'Session') {
                        $revenueData['session'][$month] += $amount;
                    }
                }
                if ($type === 'all' || $type === 'exam') {
                    if ($payment->type === 'Exam') {
                        $revenueData['exam'][$month] += $amount;
                    }
                }
            }

            $datasets = [];
            if ($type === 'all' || $type === 'registration') {
                $datasets[] = [
                    'name' => 'Registration Fees',
                    'data' => $revenueData['registration'],
                    'color' => '#8cff2e'
                ];
            }
            if ($type === 'all' || $type === 'session') {
                $datasets[] = [
                    'name' => 'Session Payments',
                    'data' => $revenueData['session'],
                    'color' => '#3b82f6'
                ];
            }
            if ($type === 'all' || $type === 'exam') {
                $datasets[] = [
                    'name' => 'Exam Fees',
                    'data' => $revenueData['exam'],
                    'color' => '#f59e0b'
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'labels' => $months,
                    'datasets' => $datasets
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get revenue trends: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student registrations trend
     */
    public function getStudentRegistrations(Request $request)
    {
        try {
            $year = $request->get('year', now()->year);
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $registrations = array_fill(0, 12, 0);

            $students = Student::whereYear('registration_date', $year)->get();

            foreach ($students as $student) {
                $month = (int)date('n', strtotime($student->registration_date)) - 1;
                $registrations[$month]++;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'labels' => $months,
                    'data' => $registrations
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get student registrations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export statistics to Excel
     */
    public function exportExcel(Request $request)
    {
        try {
            $dateRange = $request->get('date_range', 'year');
            $filterType = $request->get('filter_type', 'All');
            $filterCategory = $request->get('filter_category', 'All');
            $dateFilter = $this->getDateFilter($dateRange);

            // Get data for report with filters
            $students = Student::all();
            $instructors = Instructor::all();
            $vehicles = Vehicle::all();

            $sessions = Session::when($dateFilter, function($query) use ($dateFilter) {
                return $query->whereBetween('date', $dateFilter);
            })->when($filterType !== 'All', function($query) use ($filterType) {
                return $query->where('type', $filterType);
            })->get();

            $payments = Payment::when($dateFilter, function($query) use ($dateFilter) {
                return $query->whereBetween('date', $dateFilter);
            })->when($filterCategory !== 'All', function($query) use ($filterCategory) {
                return $query->where('type', $filterCategory);
            })->get();

            // Calculate statistics for the report
            $totalRevenue = $payments->filter(function($payment) {
                return in_array($payment->type, ['Registration', 'Session', 'Exam']);
            })->sum('amount_paid');

            $totalExpenses = $payments->filter(function($payment) {
                return in_array($payment->type, ['Maintenance', 'Incident']);
            })->sum('amount_paid');

            $netRevenue = $totalRevenue - $totalExpenses;
            $totalStudents = $students->count();
            $totalSessions = $sessions->count();
            $completedSessions = $sessions->where('status', 'Completed')->count();
            $completionRate = $totalSessions > 0 ? ($completedSessions / $totalSessions) * 100 : 0;

            // Revenue by type
            $registrationRevenue = $payments->where('type', 'Registration')->sum('amount_paid');
            $sessionRevenue = $payments->where('type', 'Session')->sum('amount_paid');
            $examRevenue = $payments->where('type', 'Exam')->sum('amount_paid');

            // Expenses by type
            $maintenanceExpenses = $payments->where('type', 'Maintenance')->sum('amount_paid');
            $incidentExpenses = $payments->where('type', 'Incident')->sum('amount_paid');

            // Payment methods distribution
            $paymentMethods = [];
            foreach ($payments as $payment) {
                $method = $payment->method ?? 'Cash';
                if (!isset($paymentMethods[$method])) {
                    $paymentMethods[$method] = ['count' => 0, 'amount' => 0];
                }
                $paymentMethods[$method]['count']++;
                $paymentMethods[$method]['amount'] += $payment->amount_paid;
            }

            // Category distribution
            $categoryDistribution = [];
            foreach ($students as $student) {
                $cat = $student->type ?? 'B';
                if (!isset($categoryDistribution[$cat])) {
                    $categoryDistribution[$cat] = 0;
                }
                $categoryDistribution[$cat]++;
            }

            // Monthly data
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $monthlyRevenue = array_fill(0, 12, 0);
            $monthlyExpenses = array_fill(0, 12, 0);

            foreach ($payments as $payment) {
                $month = date('n', strtotime($payment->date)) - 1;
                $year = date('Y', strtotime($payment->date));
                if ($year == date('Y')) {
                    if (in_array($payment->type, ['Registration', 'Session', 'Exam'])) {
                        $monthlyRevenue[$month] += $payment->amount_paid;
                    } elseif (in_array($payment->type, ['Maintenance', 'Incident'])) {
                        $monthlyExpenses[$month] += $payment->amount_paid;
                    }
                }
            }

            // Top instructors
            $topInstructors = $instructors->sortByDesc('sessions_count')
                ->when($filterType !== 'All', function($collection) use ($filterType) {
                    return $collection->filter(function($instructor) use ($filterType) {
                        return $instructor->type === $filterType || $instructor->type === 'Both';
                    });
                })
                ->take(10);

            // Recent transactions
            $recentTransactions = $payments->sortByDesc('date')->take(20);

            // Vehicle utilization
            $vehicleUtilization = $vehicles->sortByDesc('sessions_count')->take(10);

            $data = [
                'students' => $students,
                'instructors' => $instructors,
                'vehicles' => $vehicles,
                'sessions' => $sessions,
                'payments' => $payments,
                'totalRevenue' => $totalRevenue,
                'totalExpenses' => $totalExpenses,
                'netRevenue' => $netRevenue,
                'totalStudents' => $totalStudents,
                'totalSessions' => $totalSessions,
                'completionRate' => $completionRate,
                'registrationRevenue' => $registrationRevenue,
                'sessionRevenue' => $sessionRevenue,
                'examRevenue' => $examRevenue,
                'maintenanceExpenses' => $maintenanceExpenses,
                'incidentExpenses' => $incidentExpenses,
                'paymentMethods' => $paymentMethods,
                'categoryDistribution' => $categoryDistribution,
                'monthlyRevenue' => $monthlyRevenue,
                'monthlyExpenses' => $monthlyExpenses,
                'months' => $months,
                'topInstructors' => $topInstructors,
                'recentTransactions' => $recentTransactions,
                'vehicleUtilization' => $vehicleUtilization,
                'exportDate' => now()->format('Y-m-d H:i:s'),
                'dateRange' => $dateRange,
            ];

            // Create Excel export
            $export = new StatisticsExport($data);
            return Excel::download($export, 'statistics_report_' . date('Y-m-d_His') . '.xlsx');

        } catch (\Exception $e) {
            Log::error('Excel Export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Excel export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export statistics report to PDF
     */
    public function exportPdf(Request $request)
    {
        try {
            $dateRange = $request->get('date_range', 'year');
            $filterType = $request->get('filter_type', 'All');
            $filterCategory = $request->get('filter_category', 'All');
            $dateFilter = $this->getDateFilter($dateRange);

            // Fetch data with filters
            $students = Student::all();
            $instructors = Instructor::all();
            $vehicles = Vehicle::all();

            $sessions = Session::when($dateFilter, function($query) use ($dateFilter) {
                return $query->whereBetween('date', $dateFilter);
            })->when($filterType !== 'All', function($query) use ($filterType) {
                return $query->where('type', $filterType);
            })->get();

            $payments = Payment::when($dateFilter, function($query) use ($dateFilter) {
                return $query->whereBetween('date', $dateFilter);
            })->when($filterCategory !== 'All', function($query) use ($filterCategory) {
                return $query->where('type', $filterCategory);
            })->get();

            // Calculate statistics
            $totalRevenue = $payments->filter(function($payment) {
                return in_array($payment->type, ['Registration', 'Session', 'Exam']);
            })->sum('amount_paid');

            $totalExpenses = $payments->filter(function($payment) {
                return in_array($payment->type, ['Maintenance', 'Incident']);
            })->sum('amount_paid');

            $netRevenue = $totalRevenue - $totalExpenses;
            $totalStudents = $students->count();
            $totalSessions = $sessions->count();
            $completedSessions = $sessions->where('status', 'Completed')->count();
            $completionRate = $totalSessions > 0 ? ($completedSessions / $totalSessions) * 100 : 0;

            // Revenue by type
            $registrationRevenue = $payments->where('type', 'Registration')->sum('amount_paid');
            $sessionRevenue = $payments->where('type', 'Session')->sum('amount_paid');
            $examRevenue = $payments->where('type', 'Exam')->sum('amount_paid');

            // Expenses by type
            $maintenanceExpenses = $payments->where('type', 'Maintenance')->sum('amount_paid');
            $incidentExpenses = $payments->where('type', 'Incident')->sum('amount_paid');

            // Payment methods distribution
            $paymentMethods = [];
            foreach ($payments as $payment) {
                $method = $payment->method ?? 'Cash';
                if (!isset($paymentMethods[$method])) {
                    $paymentMethods[$method] = ['count' => 0, 'amount' => 0];
                }
                $paymentMethods[$method]['count']++;
                $paymentMethods[$method]['amount'] += $payment->amount_paid;
            }

            // Category distribution
            $categoryDistribution = [];
            foreach ($students as $student) {
                $cat = $student->type ?? 'B';
                if (!isset($categoryDistribution[$cat])) {
                    $categoryDistribution[$cat] = 0;
                }
                $categoryDistribution[$cat]++;
            }

            // Monthly revenue data for charts
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $monthlyRevenue = array_fill(0, 12, 0);
            $monthlyExpenses = array_fill(0, 12, 0);

            foreach ($payments as $payment) {
                $month = date('n', strtotime($payment->date)) - 1;
                $year = date('Y', strtotime($payment->date));
                if ($year == date('Y')) {
                    if (in_array($payment->type, ['Registration', 'Session', 'Exam'])) {
                        $monthlyRevenue[$month] += $payment->amount_paid;
                    } elseif (in_array($payment->type, ['Maintenance', 'Incident'])) {
                        $monthlyExpenses[$month] += $payment->amount_paid;
                    }
                }
            }

            // Monthly registrations
            $monthlyRegistrations = array_fill(0, 12, 0);
            foreach ($students as $student) {
                $month = date('n', strtotime($student->registration_date)) - 1;
                $year = date('Y', strtotime($student->registration_date));
                if ($year == date('Y')) {
                    $monthlyRegistrations[$month]++;
                }
            }

            // Top instructors with filter
            $topInstructors = $instructors->sortByDesc('sessions_count')
                ->when($filterType !== 'All', function($collection) use ($filterType) {
                    return $collection->filter(function($instructor) use ($filterType) {
                        return $instructor->type === $filterType || $instructor->type === 'Both';
                    });
                })
                ->take(5)
                ->map(function($instructor) {
                    return [
                        'name' => $instructor->first_name . ' ' . $instructor->last_name,
                        'sessions' => $instructor->sessions_count ?? 0,
                        'completion_rate' => $instructor->completion_rate ?? 0,
                        'revenue' => $instructor->revenue ?? 0,
                        'rating' => $instructor->rating ?? 0,
                    ];
                });

            // Recent transactions
            $recentTransactions = $payments->sortByDesc('date')->take(10);

            // Vehicle utilization
            $vehicleUtilization = $vehicles->sortByDesc('sessions_count')->take(5)->map(function($vehicle) {
                return [
                    'name' => $vehicle->brand . ' ' . $vehicle->model,
                    'plate' => $vehicle->plate,
                    'sessions' => $vehicle->sessions_count ?? 0,
                    'utilization' => min(100, round((($vehicle->sessions_count ?? 0) / 300) * 100)),
                ];
            });

            $data = [
                'students' => $students,
                'instructors' => $instructors,
                'vehicles' => $vehicles,
                'sessions' => $sessions,
                'payments' => $payments,
                'totalRevenue' => $totalRevenue,
                'totalExpenses' => $totalExpenses,
                'netRevenue' => $netRevenue,
                'totalStudents' => $totalStudents,
                'totalSessions' => $totalSessions,
                'completionRate' => $completionRate,
                'registrationRevenue' => $registrationRevenue,
                'sessionRevenue' => $sessionRevenue,
                'examRevenue' => $examRevenue,
                'maintenanceExpenses' => $maintenanceExpenses,
                'incidentExpenses' => $incidentExpenses,
                'paymentMethods' => $paymentMethods,
                'categoryDistribution' => $categoryDistribution,
                'monthlyRevenue' => $monthlyRevenue,
                'monthlyExpenses' => $monthlyExpenses,
                'monthlyRegistrations' => $monthlyRegistrations,
                'months' => $months,
                'topInstructors' => $topInstructors,
                'recentTransactions' => $recentTransactions,
                'vehicleUtilization' => $vehicleUtilization,
                'exportDate' => now()->format('Y-m-d H:i:s'),
                'dateRange' => $dateRange,
            ];

            $pdf = Pdf::loadView('exports.statistics-pdf', $data);
            $pdf->setPaper('A4', 'portrait');

            return $pdf->download('statistics_report_' . date('Y-m-d_His') . '.pdf');

        } catch (\Exception $e) {
            Log::error('PDF Export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'PDF export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    // ─────────────── Private Helper Methods ───────────────

    /**
     * Get date filter based on range
     */
    private function getDateFilter($dateRange)
    {
        switch ($dateRange) {
            case 'week':
                return [now()->startOfWeek(), now()->endOfWeek()];
            case 'month':
                return [now()->startOfMonth(), now()->endOfMonth()];
            case 'quarter':
                return [now()->startOfQuarter(), now()->endOfQuarter()];
            case 'year':
                return [now()->startOfYear(), now()->endOfYear()];
            default:
                return null;
        }
    }

    /**
     * Calculate KPIs including expenses
     */
    private function calculateKPIs($students, $sessions, $payments, $currentMonth, $currentYear)
    {
        // Revenue from Registration, Session, Exam
        $totalRevenue = $payments->filter(function($payment) {
            return in_array($payment->type, ['Registration', 'Session', 'Exam']);
        })->sum('amount_paid');

        // Expenses from Maintenance and Incident
        $totalExpenses = $payments->filter(function($payment) {
            return in_array($payment->type, ['Maintenance', 'Incident']);
        })->sum('amount_paid');

        $netRevenue = $totalRevenue - $totalExpenses;
        $totalStudents = $students->count();
        $totalSessions = $sessions->count();
        $completedSessions = $sessions->where('status', 'Completed')->count();
        $completionRate = $totalSessions > 0 ? ($completedSessions / $totalSessions) * 100 : 0;

        $currentMonthRevenue = $payments->filter(function($payment) use ($currentMonth, $currentYear) {
            $date = date('n', strtotime($payment->date));
            $year = date('Y', strtotime($payment->date));
            return in_array($payment->type, ['Registration', 'Session', 'Exam']) &&
                   $date == $currentMonth &&
                   $year == $currentYear;
        })->sum('amount_paid');

        $prevMonth = $currentMonth == 1 ? 12 : $currentMonth - 1;
        $prevYear = $currentMonth == 1 ? $currentYear - 1 : $currentYear;
        $previousMonthRevenue = $payments->filter(function($payment) use ($prevMonth, $prevYear) {
            $date = date('n', strtotime($payment->date));
            $year = date('Y', strtotime($payment->date));
            return in_array($payment->type, ['Registration', 'Session', 'Exam']) &&
                   $date == $prevMonth &&
                   $year == $prevYear;
        })->sum('amount_paid');

        $revenueChange = $previousMonthRevenue > 0
            ? (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100
            : 0;

        $avgRevenuePerStudent = $totalStudents > 0 ? $totalRevenue / $totalStudents : 0;

        return [
            'total_revenue' => $totalRevenue,
            'total_expenses' => $totalExpenses,
            'net_revenue' => $netRevenue,
            'total_students' => $totalStudents,
            'total_sessions' => $totalSessions,
            'completion_rate' => $completionRate,
            'avg_revenue_per_student' => $avgRevenuePerStudent,
            'revenue_change' => $revenueChange,
            'current_month_revenue' => $currentMonthRevenue,
        ];
    }

    /**
     * Calculate quick stats
     */
    private function calculateQuickStats($students, $instructors, $sessions)
    {
        $activeStudents = $students->filter(function($student) {
            return $student->payment_status !== 'Pending' || $student->initial_payment > 0;
        })->count();

        $passingRate = $students->count() > 0
            ? round(($students->where('payment_status', 'Complete')->count() / $students->count()) * 100)
            : 0;

        $avgRating = $instructors->count() > 0
            ? $instructors->avg('rating')
            : 0;

        $avgSessionDuration = $sessions->count() > 0
            ? round($sessions->avg('duration'))
            : 90;

        // Get top category
        $categoryCounts = $students->groupBy('type')->map->count();
        $topCategory = $categoryCounts->isNotEmpty() ? 'Category ' . $categoryCounts->keys()->first() : 'Category B';

        return [
            'active_students' => $activeStudents,
            'inactive_students' => $students->count() - $activeStudents,
            'passing_rate' => $passingRate,
            'avg_rating' => round($avgRating, 1),
            'avg_session_duration' => $avgSessionDuration,
            'top_category' => $topCategory,
        ];
    }

    /**
     * Get revenue data by month (Registration, Session, Exam only)
     */
    private function getRevenueByMonth($payments, $currentYear)
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $registrationRevenue = array_fill(0, 12, 0);
        $sessionRevenue = array_fill(0, 12, 0);
        $examRevenue = array_fill(0, 12, 0);

        foreach ($payments as $payment) {
            $date = date('n', strtotime($payment->date));
            $year = date('Y', strtotime($payment->date));
            $month = (int)$date - 1;
            $amount = (float)$payment->amount_paid;

            if ($year == $currentYear) {
                switch ($payment->type) {
                    case 'Registration':
                        $registrationRevenue[$month] += $amount;
                        break;
                    case 'Session':
                        $sessionRevenue[$month] += $amount;
                        break;
                    case 'Exam':
                        $examRevenue[$month] += $amount;
                        break;
                }
            }
        }

        $datasets = [];

        if (array_sum($registrationRevenue) > 0) {
            $datasets[] = [
                'name' => 'Registration Fees',
                'data' => $registrationRevenue,
                'color' => '#8cff2e'
            ];
        }

        if (array_sum($sessionRevenue) > 0) {
            $datasets[] = [
                'name' => 'Session Payments',
                'data' => $sessionRevenue,
                'color' => '#3b82f6'
            ];
        }

        if (array_sum($examRevenue) > 0) {
            $datasets[] = [
                'name' => 'Exam Fees',
                'data' => $examRevenue,
                'color' => '#f59e0b'
            ];
        }

        return [
            'labels' => $months,
            'datasets' => $datasets
        ];
    }

    /**
     * Get registrations by month
     */
    private function getRegistrationsByMonth($students, $currentYear)
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $registrations = array_fill(0, 12, 0);

        foreach ($students as $student) {
            $date = date('n', strtotime($student->registration_date));
            $year = date('Y', strtotime($student->registration_date));
            $month = (int)$date - 1;

            if ($year == $currentYear) {
                $registrations[$month]++;
            }
        }

        return [
            'labels' => $months,
            'data' => $registrations
        ];
    }

    /**
     * Get session analytics data
     */
    private function getSessionAnalyticsData($sessions, $currentYear)
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $scheduled = array_fill(0, 12, 0);
        $completed = array_fill(0, 12, 0);
        $cancelled = array_fill(0, 12, 0);
        $noShow = array_fill(0, 12, 0);

        foreach ($sessions as $session) {
            $date = date('n', strtotime($session->date));
            $year = date('Y', strtotime($session->date));
            $month = (int)$date - 1;

            if ($year == $currentYear) {
                $scheduled[$month]++;
                switch ($session->status) {
                    case 'Completed':
                        $completed[$month]++;
                        break;
                    case 'Cancelled':
                        $cancelled[$month]++;
                        break;
                    case 'No Show':
                        $noShow[$month]++;
                        break;
                }
            }
        }

        return [
            'labels' => $months,
            'scheduled' => $scheduled,
            'completed' => $completed,
            'cancelled' => $cancelled,
            'no_show' => $noShow,
        ];
    }

    /**
     * Get payment methods distribution
     */
    private function getPaymentMethodsDistribution($payments)
    {
        $methodMap = [];
        $methodColors = [
            'Cash' => '#8cff2e',
            'Bank Transfer' => '#3b82f6',
            'Card' => '#10b981',
            'Cheque' => '#f59e0b',
            'Online' => '#8b5cf6',
        ];

        // Count payments by method
        foreach ($payments as $payment) {
            $method = $payment->method ?? 'Cash';
            $methodMap[$method] = ($methodMap[$method] ?? 0) + 1;
        }

        $totalTransactions = array_sum($methodMap);
        $distribution = [];

        if ($totalTransactions > 0) {
            foreach ($methodMap as $method => $count) {
                $distribution[] = [
                    'name' => $method,
                    'value' => round(($count / $totalTransactions) * 100),
                    'color' => $methodColors[$method] ?? '#64748b',
                    'count' => $count,
                ];
            }
        } else {
            // Default distribution if no payments
            $distribution = [
                ['name' => 'Cash', 'value' => 100, 'color' => '#8cff2e', 'count' => 0],
            ];
        }

        // Sort by value descending
        usort($distribution, function($a, $b) {
            return $b['value'] - $a['value'];
        });

        return $distribution;
    }

    /**
     * Get category distribution
     */
    private function getCategoryDistribution($students)
    {
        $categoryMap = [];
        $categoryColors = [
            'B' => '#8cff2e',
            'A' => '#3b82f6',
            'A1' => '#06b6d4',
            'C' => '#f59e0b',
            'D' => '#ef4444',
            'BE' => '#8b5cf6',
        ];

        foreach ($students as $student) {
            $cat = $student->type ?? 'B';
            $categoryMap[$cat] = ($categoryMap[$cat] ?? 0) + 1;
        }

        $totalStudents = $students->count();
        $distribution = [];

        foreach ($categoryMap as $category => $count) {
            $distribution[] = [
                'name' => "Category {$category}",
                'value' => $totalStudents > 0 ? round(($count / $totalStudents) * 100) : 0,
                'color' => $categoryColors[$category] ?? '#64748b',
                'count' => $count,
            ];
        }

        usort($distribution, function($a, $b) {
            return $b['value'] - $a['value'];
        });

        return $distribution;
    }

    /**
     * Get top instructors with session type filter
     */
    private function getTopInstructors($instructors, $filterType = 'All')
    {
        $filteredInstructors = $instructors;

        if ($filterType !== 'All') {
            $filteredInstructors = $instructors->filter(function($instructor) use ($filterType) {
                return $instructor->type === $filterType || $instructor->type === 'Both';
            });
        }

        return $filteredInstructors->sortByDesc('sessions_count')
            ->take(5)
            ->map(function($instructor) {
                return [
                    'id' => $instructor->id,
                    'name' => $instructor->first_name . ' ' . $instructor->last_name,
                    'sessions' => $instructor->sessions_count ?? 0,
                    'completion_rate' => $instructor->completion_rate ?? 0,
                    'revenue' => $instructor->revenue ?? 0,
                    'rating' => $instructor->rating ?? 0,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get recent transactions
     */
    private function getRecentTransactions($payments)
    {
        return $payments->sortByDesc('date')
            ->take(10)
            ->map(function($payment) {
                return [
                    'id' => $payment->id,
                    'date' => $payment->date,
                    'student' => $payment->student_name,
                    'amount' => $payment->amount_paid,
                    'type' => $payment->type,
                    'status' => $payment->status,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get vehicle utilization
     */
    private function getVehicleUtilization($vehicles)
    {
        return $vehicles->sortByDesc('sessions_count')
            ->take(5)
            ->map(function($vehicle) {
                $utilization = min(100, round((($vehicle->sessions_count ?? 0) / 300) * 100));
                return [
                    'id' => $vehicle->id,
                    'name' => $vehicle->brand . ' ' . $vehicle->model,
                    'plate' => $vehicle->plate,
                    'sessions' => $vehicle->sessions_count ?? 0,
                    'utilization' => $utilization,
                ];
            })
            ->values()
            ->toArray();
    }
}
