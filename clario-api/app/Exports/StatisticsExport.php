<?php
// app/Exports/StatisticsExport.php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class StatisticsExport implements FromArray, WithHeadings, WithStyles, ShouldAutoSize, WithTitle
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function title(): string
    {
        return 'Statistics Report';
    }

    public function headings(): array
    {
        return [];
    }

    public function array(): array
    {
        $rows = [];

        // ==================== TITLE SECTION ====================
        $rows[] = ['STATISTICS REPORT'];
        $rows[] = ['Generated on:', $this->data['exportDate']];
        $rows[] = ['Period:', ucfirst($this->data['dateRange'])];
        $rows[] = [];

        // ==================== EXECUTIVE SUMMARY ====================
        $rows[] = ['EXECUTIVE SUMMARY'];
        $rows[] = ['Total Revenue', number_format($this->data['totalRevenue']) . ' MAD'];
        $rows[] = ['Total Expenses', number_format($this->data['totalExpenses'] ?? 0) . ' MAD'];
        $rows[] = ['Net Revenue', number_format($this->data['netRevenue'] ?? 0) . ' MAD'];
        $rows[] = ['Total Students', $this->data['totalStudents']];
        $rows[] = ['Total Sessions', $this->data['totalSessions']];
        $rows[] = ['Completion Rate', number_format($this->data['completionRate'], 1) . '%'];
        $rows[] = ['Total Instructors', $this->data['instructors']->count()];
        $rows[] = ['Total Vehicles', $this->data['vehicles']->count()];
        $rows[] = [];

        // ==================== EXPENSE BREAKDOWN ====================
        $rows[] = ['EXPENSE BREAKDOWN'];
        $rows[] = ['Expense Type', 'Amount (MAD)', 'Percentage of Total Expenses'];

        $totalExpenses = $this->data['totalExpenses'] ?? 0;
        $maintenanceExpenses = $this->data['maintenanceExpenses'] ?? 0;
        $incidentExpenses = $this->data['incidentExpenses'] ?? 0;

        $rows[] = ['Maintenance', number_format($maintenanceExpenses), $totalExpenses > 0 ? number_format(($maintenanceExpenses / $totalExpenses) * 100, 1) . '%' : '0%'];
        $rows[] = ['Incidents', number_format($incidentExpenses), $totalExpenses > 0 ? number_format(($incidentExpenses / $totalExpenses) * 100, 1) . '%' : '0%'];
        $rows[] = ['TOTAL EXPENSES', number_format($totalExpenses), '100%'];
        $rows[] = [];

        // ==================== QUICK STATISTICS ====================
        $rows[] = ['QUICK STATISTICS'];
        $rows[] = ['Metric', 'Value'];
        $rows[] = ['Fully Paid Students', $this->data['students']->where('payment_status', 'Complete')->count()];
        $rows[] = ['Partial Payment Students', $this->data['students']->where('payment_status', 'Partial')->count()];
        $rows[] = ['Pending Payment Students', $this->data['students']->where('payment_status', 'Pending')->count()];
        $rows[] = ['Completed Sessions', $this->data['sessions']->where('status', 'Completed')->count()];
        $rows[] = ['Scheduled Sessions', $this->data['sessions']->where('status', 'Scheduled')->count()];
        $rows[] = ['Cancelled Sessions', $this->data['sessions']->where('status', 'Cancelled')->count()];
        $rows[] = ['Active Vehicles', $this->data['vehicles']->where('status', 'Active')->count()];
        $rows[] = ['Vehicles in Maintenance', $this->data['vehicles']->where('status', 'Maintenance')->count()];
        $rows[] = ['Inactive Vehicles', $this->data['vehicles']->where('status', 'Inactive')->count()];
        $rows[] = [];

        // ==================== REVENUE BREAKDOWN ====================
        $rows[] = ['REVENUE BREAKDOWN'];
        $rows[] = ['Payment Type', 'Amount (MAD)', 'Percentage'];

        $grandTotal = ($this->data['registrationRevenue'] ?? 0) + ($this->data['sessionRevenue'] ?? 0) + ($this->data['examRevenue'] ?? 0);
        $rows[] = ['Registration Fees', number_format($this->data['registrationRevenue'] ?? 0), $grandTotal > 0 ? number_format((($this->data['registrationRevenue'] ?? 0) / $grandTotal) * 100, 1) . '%' : '0%'];
        $rows[] = ['Session Payments', number_format($this->data['sessionRevenue'] ?? 0), $grandTotal > 0 ? number_format((($this->data['sessionRevenue'] ?? 0) / $grandTotal) * 100, 1) . '%' : '0%'];
        $rows[] = ['Exam Fees', number_format($this->data['examRevenue'] ?? 0), $grandTotal > 0 ? number_format((($this->data['examRevenue'] ?? 0) / $grandTotal) * 100, 1) . '%' : '0%'];
        $rows[] = ['TOTAL REVENUE', number_format($grandTotal), '100%'];
        $rows[] = [];

        // ==================== MONTHLY REVENUE ====================
        $rows[] = ['MONTHLY REVENUE TREND'];
        $rows[] = ['Month', 'Revenue (MAD)'];
        foreach ($this->data['months'] as $index => $month) {
            $rows[] = [$month, number_format($this->data['monthlyRevenue'][$index] ?? 0)];
        }
        $rows[] = [];

        // ==================== MONTHLY EXPENSES ====================
        if (isset($this->data['monthlyExpenses'])) {
            $rows[] = ['MONTHLY EXPENSES TREND'];
            $rows[] = ['Month', 'Expenses (MAD)'];
            foreach ($this->data['months'] as $index => $month) {
                $rows[] = [$month, number_format($this->data['monthlyExpenses'][$index] ?? 0)];
            }
            $rows[] = [];
        }

        // ==================== PAYMENT METHODS DISTRIBUTION ====================
        $rows[] = ['PAYMENT METHODS DISTRIBUTION'];
        $rows[] = ['Method', 'Transactions', 'Amount (MAD)', 'Percentage'];

        $totalAmount = array_sum(array_column($this->data['paymentMethods'], 'amount'));
        foreach ($this->data['paymentMethods'] as $method => $stats) {
            $percentage = $totalAmount > 0 ? round(($stats['amount'] / $totalAmount) * 100, 1) : 0;
            $rows[] = [$method, $stats['count'], number_format($stats['amount']), $percentage . '%'];
        }
        $rows[] = [];

        // ==================== CATEGORY DISTRIBUTION ====================
        $rows[] = ['CATEGORY DISTRIBUTION'];
        $rows[] = ['Category', 'Students', 'Percentage'];

        $totalStudents = $this->data['totalStudents'];
        foreach ($this->data['categoryDistribution'] as $category => $count) {
            $percentage = $totalStudents > 0 ? round(($count / $totalStudents) * 100, 1) : 0;
            $rows[] = ["Category {$category}", $count, $percentage . '%'];
        }
        $rows[] = [];

        // ==================== TOP INSTRUCTORS ====================
        $rows[] = ['TOP PERFORMING INSTRUCTORS'];
        $rows[] = ['Name', 'Sessions', 'Completion Rate', 'Revenue (MAD)', 'Rating'];
        foreach ($this->data['topInstructors'] as $instructor) {
            $rows[] = [
                $instructor['name'] ?? ($instructor->first_name . ' ' . $instructor->last_name),
                $instructor['sessions'] ?? ($instructor->sessions_count ?? 0),
                number_format($instructor['completion_rate'] ?? ($instructor->completion_rate ?? 0), 1) . '%',
                number_format($instructor['revenue'] ?? ($instructor->revenue ?? 0)),
                number_format($instructor['rating'] ?? ($instructor->rating ?? 0), 1),
            ];
        }
        $rows[] = [];

        // ==================== RECENT TRANSACTIONS ====================
        $rows[] = ['RECENT TRANSACTIONS (Last 10)'];
        $rows[] = ['Date', 'Student/Expense', 'Amount (MAD)', 'Type', 'Status', 'Method'];
        foreach ($this->data['recentTransactions'] as $transaction) {
            $isExpense = in_array($transaction->type, ['Maintenance', 'Incident']);
            $rows[] = [
                $transaction->date,
                $isExpense ? $transaction->type : $transaction->student_name,
                number_format($transaction->amount_paid),
                $transaction->type,
                $transaction->status,
                $transaction->method ?? 'Cash',
            ];
        }
        $rows[] = [];

        // ==================== VEHICLE UTILIZATION ====================
        $rows[] = ['VEHICLE UTILIZATION'];
        $rows[] = ['Vehicle', 'Plate', 'Sessions', 'Utilization', 'Status'];
        foreach ($this->data['vehicleUtilization'] as $vehicle) {
            $utilization = min(100, round((($vehicle->sessions_count ?? 0) / 300) * 100));
            $rows[] = [
                $vehicle->brand . ' ' . $vehicle->model,
                $vehicle->plate,
                $vehicle->sessions_count ?? 0,
                $utilization . '%',
                $vehicle->status,
            ];
        }
        $rows[] = [];

        // ==================== STUDENTS LIST ====================
        $rows[] = ['STUDENTS LIST'];
        $rows[] = ['ID', 'Name', 'Email', 'Phone', 'Category', 'Registration Date', 'Payment Status'];
        foreach ($this->data['students'] as $student) {
            $rows[] = [
                $student->id,
                $student->first_name . ' ' . $student->last_name,
                $student->email,
                $student->phone,
                $student->type,
                $student->registration_date,
                $student->payment_status,
            ];
        }
        $rows[] = [];

        // ==================== SESSIONS LIST ====================
        $rows[] = ['SESSIONS LIST'];
        $rows[] = ['ID', 'Student', 'Instructor', 'Date', 'Type', 'Status', 'Price (MAD)', 'Duration'];
        foreach ($this->data['sessions'] as $session) {
            $rows[] = [
                $session->id,
                $session->student_name,
                $session->instructor_name,
                $session->date,
                $session->type,
                $session->status,
                number_format($session->price),
                $session->duration . ' min',
            ];
        }

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        // Style for main title
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->mergeCells('A1:F1');

        // Style for section headers
        $sectionRows = [5, 15, 23, 31, 37, 43, 51, 58, 66, 74, 82];
        foreach ($sectionRows as $row) {
            if ($sheet->getCell("A{$row}")->getValue()) {
                $sheet->getStyle("A{$row}")->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle("A{$row}")->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setRGB('8cff2e');
            }
        }

        // Add borders to all data
        $lastRow = $sheet->getHighestRow();
        if ($lastRow > 1) {
            $sheet->getStyle("A1:F{$lastRow}")->getBorders()->getAllBorders()
                ->setBorderStyle(Border::BORDER_THIN);
        }

        return [];
    }
}
