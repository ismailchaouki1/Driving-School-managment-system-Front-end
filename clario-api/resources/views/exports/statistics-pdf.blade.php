{{-- resources/views/exports/statistics-pdf.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Statistics Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', 'Segoe UI', Arial, sans-serif;
            background: #fff;
            color: #333;
            font-size: 11px;
            line-height: 1.4;
            padding: 20px;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px solid #8cff2e;
        }

        .header h1 {
            font-size: 24px;
            color: #0d0d0d;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 11px;
            color: #666;
        }

        .report-meta {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #eee;
            font-size: 10px;
            color: #888;
        }

        /* Section */
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0d0d0d;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid #8cff2e;
            display: inline-block;
        }

        /* KPI Grid */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }

        .kpi-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 12px;
            text-align: center;
        }

        .kpi-value {
            font-size: 24px;
            font-weight: bold;
            color: #8cff2e;
            margin-bottom: 4px;
        }

        .kpi-value.expense {
            color: #ef4444;
        }

        .kpi-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
        }

        .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }

        .stat-label {
            font-size: 10px;
            color: #888;
            margin-top: 4px;
        }

        /* Tables */
        .table-wrapper {
            overflow-x: auto;
            margin-bottom: 15px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }

        .data-table th {
            background: #f0f0f0;
            padding: 8px 6px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #ddd;
        }

        .data-table td {
            padding: 6px;
            border-bottom: 1px solid #eee;
        }

        .data-table tr:hover {
            background: #f9f9f9;
        }

        .expense-row {
            background-color: #fef2f2;
        }

        /* Chart Containers */
        .charts-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }

        .chart-container {
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 12px;
            background: #fff;
        }

        .chart-title {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid #eee;
        }

        /* Bar Chart */
        .bar-chart {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            height: 160px;
            gap: 8px;
            padding: 8px 0;
        }

        .bar-wrapper {
            flex: 1;
            text-align: center;
        }

        .bar {
            background: linear-gradient(180deg, #8cff2e, #6ecc24);
            width: 100%;
            max-width: 40px;
            margin: 0 auto;
            border-radius: 4px 4px 0 0;
        }

        .bar.expense-bar {
            background: linear-gradient(180deg, #ef4444, #dc2626);
        }

        .bar-label {
            font-size: 9px;
            color: #888;
            margin-top: 6px;
        }

        .bar-value {
            font-size: 9px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        /* Badges */
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
        }

        .badge-paid, .badge-completed {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
        }

        .badge-pending, .badge-scheduled {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .badge-cancelled {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }

        /* Footer */
        .footer {
            margin-top: 25px;
            padding-top: 12px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 9px;
            color: #999;
        }

        /* Page Break */
        .page-break {
            page-break-before: always;
        }

        /* Text Utilities */
        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .font-bold {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        {{-- Header --}}
        <div class="header">
            <h1>Statistics Report</h1>
            <p>Driving School Management System</p>
            <div class="report-meta">
                <span>Generated: {{ $exportDate }}</span>
                <span>Period: {{ ucfirst($dateRange) }}</span>
                <span>Report ID: RPT-{{ date('YmdHis') }}</span>
            </div>
        </div>

        {{-- Executive Summary --}}
        <div class="section">
            <h2 class="section-title">Executive Summary</h2>
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-value">{{ number_format($totalRevenue ?? 0) }} MAD</div>
                    <div class="kpi-label">Total Revenue</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value expense">{{ number_format($totalExpenses ?? 0) }} MAD</div>
                    <div class="kpi-label">Total Expenses</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value">{{ number_format(($totalRevenue ?? 0) - ($totalExpenses ?? 0)) }} MAD</div>
                    <div class="kpi-label">Net Revenue</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value">{{ $totalStudents ?? 0 }}</div>
                    <div class="kpi-label">Total Students</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value">{{ $totalSessions ?? 0 }}</div>
                    <div class="kpi-label">Total Sessions</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-value">{{ number_format($completionRate ?? 0, 1) }}%</div>
                    <div class="kpi-label">Completion Rate</div>
                </div>
            </div>
        </div>

        {{-- Expense Breakdown --}}
        <div class="section">
            <h2 class="section-title">Expense Breakdown</h2>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Expense Type</th>
                            <th class="text-right">Amount (MAD)</th>
                            <th class="text-right">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php
                            $totalExpenses = $maintenanceExpenses + $incidentExpenses;
                        @endphp
                        <tr>
                            <td>Maintenance</td>
                            <td class="text-right">{{ number_format($maintenanceExpenses ?? 0) }}</td>
                            <td class="text-right">{{ $totalExpenses > 0 ? number_format(($maintenanceExpenses / $totalExpenses) * 100, 1) : 0 }}%</td>
                        </tr>
                        <tr>
                            <td>Incidents</td>
                            <td class="text-right">{{ number_format($incidentExpenses ?? 0) }}</td>
                            <td class="text-right">{{ $totalExpenses > 0 ? number_format(($incidentExpenses / $totalExpenses) * 100, 1) : 0 }}%</td>
                        </tr>
                        <tr style="background: #f0f0f0; font-weight: bold;">
                            <td>Total Expenses</td>
                            <td class="text-right">{{ number_format($totalExpenses) }}</td>
                            <td class="text-right">100%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Revenue & Expenses Chart --}}
        <div class="section">
            <h2 class="section-title">Monthly Revenue vs Expenses</h2>
            <div class="chart-container">
                <div class="bar-chart">
                    @php
                        $maxValue = max(max($monthlyRevenue ?? [0]), max($monthlyExpenses ?? [0]), 1);
                    @endphp
                    @foreach($months as $index => $month)
                        @php
                            $revenue = $monthlyRevenue[$index] ?? 0;
                            $expense = $monthlyExpenses[$index] ?? 0;
                            $revenueHeight = ($revenue / $maxValue) * 120;
                            $expenseHeight = ($expense / $maxValue) * 120;
                        @endphp
                        <div class="bar-wrapper">
                            <div class="bar-value">{{ number_format($revenue / 1000, 1) }}k</div>
                            <div class="bar" style="height: {{ $revenueHeight }}px;"></div>
                            <div class="bar expense-bar" style="height: {{ $expenseHeight }}px;"></div>
                            <div class="bar-label">{{ $month }}</div>
                        </div>
                    @endforeach
                </div>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 12px; height: 12px; background: #8cff2e; border-radius: 2px;"></div>
                        <span style="font-size: 9px;">Revenue</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 2px;"></div>
                        <span style="font-size: 9px;">Expenses</span>
                    </div>
                </div>
            </div>
        </div>

        {{-- Revenue Breakdown --}}
        <div class="section">
            <h2 class="section-title">Revenue Breakdown</h2>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Payment Type</th>
                            <th class="text-right">Amount (MAD)</th>
                            <th class="text-right">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php
                            $grandTotal = ($registrationRevenue ?? 0) + ($sessionRevenue ?? 0) + ($examRevenue ?? 0);
                        @endphp
                        <tr>
                            <td>Registration Fees</td>
                            <td class="text-right">{{ number_format($registrationRevenue ?? 0) }}</td>
                            <td class="text-right">{{ $grandTotal > 0 ? number_format((($registrationRevenue ?? 0) / $grandTotal) * 100, 1) : 0 }}%</td>
                        </tr>
                        <tr>
                            <td>Session Payments</td>
                            <td class="text-right">{{ number_format($sessionRevenue ?? 0) }}</td>
                            <td class="text-right">{{ $grandTotal > 0 ? number_format((($sessionRevenue ?? 0) / $grandTotal) * 100, 1) : 0 }}%</td>
                        </tr>
                        <tr>
                            <td>Exam Fees</td>
                            <td class="text-right">{{ number_format($examRevenue ?? 0) }}</td>
                            <td class="text-right">{{ $grandTotal > 0 ? number_format((($examRevenue ?? 0) / $grandTotal) * 100, 1) : 0 }}%</td>
                        </tr>
                        <tr style="background: #f0f0f0; font-weight: bold;">
                            <td>Total Revenue</td>
                            <td class="text-right">{{ number_format($grandTotal) }}</td>
                            <td class="text-right">100%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Recent Transactions --}}
        <div class="section">
            <h2 class="section-title">Recent Transactions</h2>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student/Expense</th>
                            <th class="text-right">Amount (MAD)</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($recentTransactions as $transaction)
                            @php
                                $isExpense = in_array($transaction->type, ['Maintenance', 'Incident']);
                            @endphp
                            <tr class="{{ $isExpense ? 'expense-row' : '' }}">
                                <td>{{ $transaction->date }}</td>
                                <td>{{ $isExpense ? $transaction->type : $transaction->student_name }}</td>
                                <td class="text-right">{{ number_format($transaction->amount_paid) }}</td>
                                <td>{{ $transaction->type }}</td>
                                <td><span class="badge badge-{{ strtolower($transaction->status) }}">{{ $transaction->status }}</span></td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="text-center">No transactions available</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Vehicle Utilization --}}
        <div class="section">
            <h2 class="section-title">Vehicle Utilization</h2>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Vehicle</th>
                            <th>Plate</th>
                            <th class="text-right">Sessions</th>
                            <th class="text-right">Maintenance Records</th>
                            <th class="text-right">Utilization</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($vehicleUtilization as $vehicle)
                            <tr>
                                <td>{{ $vehicle['name'] }}</td>
                                <td>{{ $vehicle['plate'] }}</td>
                                <td class="text-right">{{ $vehicle['sessions'] }}</td>
                                <td class="text-right">{{ $vehicle['maintenance_count'] ?? 0 }}</td>
                                <td class="text-right">{{ $vehicle['utilization'] }}%</td>
                                <td>
                                    <span class="badge badge-{{ strtolower($vehicle['status'] ?? 'active') }}">
                                        {{ $vehicle['status'] ?? 'Active' }}
                                    </span>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center">No vehicle data available</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Footer --}}
        <div class="footer">
            <p>This report is automatically generated by the Driving School Management System.</p>
            <p>&copy; {{ date('Y') }} All rights reserved.</p>
        </div>
    </div>
</body>
</html>
