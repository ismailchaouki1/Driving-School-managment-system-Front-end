<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payments Report</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #8cff2e;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .summary {
            margin: 15px 0;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 5px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
        .summary-item {
            text-align: center;
            padding: 5px 15px;
        }
        .summary-label {
            font-size: 11px;
            color: #666;
        }
        .summary-value {
            font-size: 16px;
            font-weight: bold;
            color: #8cff2e;
        }
        .expense-value {
            color: #ef4444;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #8cff2e;
            color: #0d0d0d;
            font-weight: bold;
        }
        .expense-row {
            background-color: #fef2f2;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 9px;
            color: #666;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-paid {
            background: #10b981;
            color: white;
        }
        .badge-pending {
            background: #f59e0b;
            color: white;
        }
        .badge-partial {
            background: #3b82f6;
            color: white;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Payments Report</h1>
        <p>Generated on: {{ $exportDate }}</p>
    </div>

    <div class="summary">
        <div class="summary-item">
            <div class="summary-value">{{ number_format($totalRevenue ?? 0, 2) }} DH</div>
            <div class="summary-label">Total Revenue</div>
        </div>
        <div class="summary-item">
            <div class="summary-value expense-value">{{ number_format($totalExpenses ?? 0, 2) }} DH</div>
            <div class="summary-label">Total Expenses</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{{ number_format(($totalRevenue ?? 0) - ($totalExpenses ?? 0), 2) }} DH</div>
            <div class="summary-label">Net Revenue</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{{ number_format($totalPending ?? 0, 2) }} DH</div>
            <div class="summary-label">Pending Balance</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{{ $paidCount ?? 0 }}</div>
            <div class="summary-label">Paid</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{{ $partialCount ?? 0 }}</div>
            <div class="summary-label">Partial</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{{ $pendingCount ?? 0 }}</div>
            <div class="summary-label">Pending</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{{ $overdueCount ?? 0 }}</div>
            <div class="summary-label">Overdue</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Reference</th>
                <th>Student/Expense</th>
                <th>CIN</th>
                <th>Type</th>
                <th>Total (DH)</th>
                <th>Paid (DH)</th>
                <th>Remaining (DH)</th>
                <th>Status</th>
                <th>Method</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @forelse($payments as $payment)
            @php
                $isExpense = in_array($payment->type, ['Maintenance', 'Incident']);
            @endphp
            <tr class="{{ $isExpense ? 'expense-row' : '' }}">
                <td>{{ $payment->reference }}</td>
                <td>{{ $isExpense ? $payment->type : $payment->student_name }}</td>
                <td>{{ $isExpense ? 'SYS-' . $payment->type : $payment->student_cin }}</td>
                <td>{{ $payment->type }}</td>
                <td style="text-align: right">{{ number_format($payment->amount_total, 2) }}</td>
                <td style="text-align: right">{{ number_format($payment->amount_paid, 2) }}</td>
                <td style="text-align: right">{{ number_format($payment->amount_remaining, 2) }}</td>
                <td>
                    <span class="badge badge-{{ strtolower($payment->status) }}">
                        {{ $payment->status }}
                    </span>
                </td>
                <td>{{ $payment->method }}</td>
                <td>{{ $payment->date }}</td>
            </tr>
            @empty
                <tr>
                    <td colspan="10" style="text-align: center">No payments found</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Clario Driving School - Payment Management System</p>
        <p>This report is system-generated. For any queries, please contact the administrator.</p>
    </div>
</body>
</html>
