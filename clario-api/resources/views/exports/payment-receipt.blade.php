<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Receipt - {{ $payment->reference }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            margin: 30px;
        }
        .receipt {
            max-width: 700px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #8cff2e;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #8cff2e;
        }
        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
        }
        .title.expense {
            color: #ef4444;
        }
        .title.revenue {
            color: #10b981;
        }
        .info-row {
            margin: 10px 0;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 160px;
        }
        .amount {
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #8cff2e;
            text-align: right;
        }
        .amount.expense {
            border-top-color: #ef4444;
            color: #ef4444;
        }
        .amount.revenue {
            border-top-color: #10b981;
            color: #10b981;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .expense-note {
            background: #fef2f2;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
            font-size: 11px;
            color: #ef4444;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>Clario Driving School</h1>
            <p>Official {{ in_array($payment->type, ['Maintenance', 'Incident']) ? 'Expense' : 'Payment' }} Receipt</p>
        </div>

        @php
            $isExpense = in_array($payment->type, ['Maintenance', 'Incident']);
        @endphp

        <div class="title {{ $isExpense ? 'expense' : 'revenue' }}">
            {{ $isExpense ? 'EXPENSE RECEIPT' : 'PAYMENT RECEIPT' }}
        </div>

        <div class="info-row">
            <span class="info-label">Receipt Number:</span>
            <span>{{ $payment->receipt_number ?? 'N/A' }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Transaction Reference:</span>
            <span>{{ $payment->reference }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Date:</span>
            <span>{{ $payment->date }}</span>
        </div>

        @if(!$isExpense)
        <div class="info-row">
            <span class="info-label">Student Name:</span>
            <span>{{ $payment->student_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">CIN:</span>
            <span>{{ $payment->student_cin }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Category:</span>
            <span>{{ $payment->category }}</span>
        </div>
        @else
        <div class="info-row">
            <span class="info-label">Expense Type:</span>
            <span>{{ $payment->type }}</span>
        </div>
        @if($payment->vehicle_id)
        <div class="info-row">
            <span class="info-label">Vehicle ID:</span>
            <span>{{ $payment->vehicle_id }}</span>
        </div>
        @endif
        @endif

        <div class="info-row">
            <span class="info-label">Transaction Type:</span>
            <span>{{ $payment->type }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Payment Method:</span>
            <span>{{ $payment->method }}</span>
        </div>

        @if($payment->notes)
        <div class="info-row">
            <span class="info-label">Description:</span>
            <span>{{ $payment->notes }}</span>
        </div>
        @endif

        <div class="amount {{ $isExpense ? 'expense' : 'revenue' }}">
            <strong>{{ $isExpense ? 'Amount Paid:' : 'Amount Paid:' }}</strong>
            {{ number_format($payment->amount_paid, 2) }} DH
        </div>

        @if(!$isExpense)
        <div class="info-row">
            <span class="info-label">Total Amount:</span>
            <span>{{ number_format($payment->amount_total, 2) }} DH</span>
        </div>
        <div class="info-row">
            <span class="info-label">Remaining Balance:</span>
            <span>{{ number_format($payment->amount_remaining, 2) }} DH</span>
        </div>
        @endif

        <div class="info-row">
            <span class="info-label">Status:</span>
            <span>{{ $payment->status }}</span>
        </div>

        @if($isExpense)
        <div class="expense-note">
            <strong>Note:</strong> This is an expense record for vehicle {{ $payment->type }}.
            It has been deducted from the total revenue.
        </div>
        @endif

        <div class="footer">
            <p>Thank you for {{ $isExpense ? 'your business' : 'choosing Clario Driving School' }}!</p>
            <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
        </div>
    </div>
</body>
</html>
