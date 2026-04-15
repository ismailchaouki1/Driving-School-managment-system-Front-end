<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Session Receipt</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            margin: 30px;
        }
        .receipt {
            max-width: 600px;
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
        .info-row {
            margin: 10px 0;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 140px;
        }
        .total {
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #8cff2e;
            text-align: right;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .payment-status {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .payment-paid {
            background: #10b981;
            color: white;
        }
        .payment-pending {
            background: #f59e0b;
            color: white;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>Clario Driving School</h1>
            <p>Official Session Receipt</p>
        </div>

        <div class="title">
            SESSION RECEIPT
        </div>

        <div class="info-row">
            <span class="info-label">Receipt Number:</span>
            <span>SESS-{{ str_pad($session->id, 6, '0', STR_PAD_LEFT) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Date:</span>
            <span>{{ $session->date }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Time:</span>
            <span>{{ substr($session->start_time, 0, 5) }} - {{ substr($session->end_time, 0, 5) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Student Name:</span>
            <span>{{ $session->student_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Category:</span>
            <span>{{ $session->student_category }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Instructor:</span>
            <span>{{ $session->instructor_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Session Type:</span>
            <span>{{ $session->type }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Duration:</span>
            <span>{{ $session->duration }} minutes</span>
        </div>
        @if($session->location)
        <div class="info-row">
            <span class="info-label">Location:</span>
            <span>{{ $session->location }}</span>
        </div>
        @endif
        @if($session->vehicle_plate)
        <div class="info-row">
            <span class="info-label">Vehicle:</span>
            <span>{{ $session->vehicle_plate }}</span>
        </div>
        @endif
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span>{{ $session->status }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Payment Status:</span>
            <span>
                <span class="payment-status payment-{{ strtolower($session->payment_status) }}">
                    {{ $session->payment_status }}
                </span>
            </span>
        </div>

        <div class="total">
            Amount Paid: {{ number_format($session->price, 2) }} MAD
        </div>

        @if($session->payment_status == 'Pending')
        <div style="background: #fef2f2; padding: 10px; border-radius: 5px; margin-top: 15px; font-size: 11px; color: #ef4444;">
            <strong>Note:</strong> This payment is pending. Please complete the payment at your earliest convenience.
        </div>
        @endif

        <div class="footer">
            <p>Thank you for choosing Clario Driving School!</p>
            <p>This is a computer-generated receipt. No signature required.</p>
        </div>
    </div>
</body>
</html>
