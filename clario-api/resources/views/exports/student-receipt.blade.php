<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Student Receipt - {{ $student->first_name }} {{ $student->last_name }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            margin: 30px;
        }
        .receipt-container {
            max-width: 800px;
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
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
        }
        .receipt-title {
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 8px;
            border: none;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 30%;
            background-color: #f5f5f5;
        }
        .amount-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
        }
        .amount-table th, .amount-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .amount-table th {
            background-color: #8cff2e;
            color: #0d0d0d;
        }
        .total-row {
            font-weight: bold;
            background-color: #f5f5f5;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
        }
        .status-Complete { background-color: #10b981; color: white; }
        .status-Partial { background-color: #f59e0b; color: white; }
        .status-Pending { background-color: #ef4444; color: white; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .signature {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        .payment-schedule {
            margin-top: 20px;
            padding: 10px;
            background: #f8fafc;
            border-radius: 5px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <h1>Clario Driving School</h1>
            <p>Student Registration Receipt</p>
        </div>

        <div class="receipt-title">
            OFFICIAL RECEIPT
        </div>

        <table class="info-table">
            <tr>
                <td>Receipt Number:</td>
                <td><strong>RCP-{{ str_pad($student->id, 6, '0', STR_PAD_LEFT) }}</strong></td>
                <td>Date:</td>
                <td><strong>{{ now()->format('d/m/Y') }}</strong></td>
            </tr>
            <tr>
                <td>Student Name:</td>
                <td><strong>{{ $student->first_name }} {{ $student->last_name }}</strong></td>
                <td>CIN:</td>
                <td><strong>{{ $student->cin }}</strong></td>
            </tr>
            <tr>
                <td>Phone:</td>
                <td>{{ $student->phone }}</td>
                <td>Category:</td>
                <td><strong>{{ $student->type }}</strong></td>
            </tr>
            <tr>
                <td>Registration Date:</td>
                <td>{{ $student->registration_date }}</td>
                <td>Status:</td>
                <td><span class="status status-{{ $student->payment_status }}">{{ $student->payment_status }}</span></td>
            </tr>
        </table>

        <table class="amount-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount (MAD)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Registration Fee - Category {{ $student->type }}</td>
                    <td style="text-align: right">{{ number_format($student->total_price, 2) }}</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total Amount</strong></td>
                    <td style="text-align: right"><strong>{{ number_format($student->total_price, 2) }}</strong></td>
                </tr>
                <tr>
                    <td>Amount Paid</td>
                    <td style="text-align: right">{{ number_format($student->initial_payment, 2) }}</td>
                </tr>
                <tr>
                    <td>Remaining Balance</td>
                    <td style="text-align: right">{{ number_format($student->total_price - $student->initial_payment, 2) }}</td>
                </tr>
            </tbody>
        </table>

        @php
            $remaining = $student->total_price - $student->initial_payment;
        @endphp

        @if($remaining > 0)
        <div class="payment-schedule">
            <strong>Payment Schedule:</strong>
            <p style="margin-top: 8px;">
                The remaining balance of <strong>{{ number_format($remaining, 2) }} MAD</strong> is due within
                3 months from the registration date ({{ $student->registration_date }}).
            </p>
        </div>
        @endif

        <div class="signature">
            <div>
                <p>Student Signature: _________________</p>
            </div>
            <div>
                <p>Authorized Signature: _________________</p>
            </div>
        </div>

        <div class="footer">
            <p>Thank you for choosing Clario Driving School!</p>
            <p>This is a computer-generated receipt. No signature required.</p>
        </div>
    </div>
</body>
</html>
