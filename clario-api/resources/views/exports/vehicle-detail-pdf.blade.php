<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vehicle Details - {{ $vehicle->plate }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            margin: 30px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
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
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .vehicle-info {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .info-row {
            margin: 8px 0;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 180px;
        }
        .section {
            margin-top: 20px;
            page-break-inside: avoid;
        }
        .section-title {
            background-color: #8cff2e;
            color: #0d0d0d;
            padding: 8px;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
        }
        .status-Active {
            background-color: #10b981;
            color: white;
        }
        .status-Maintenance {
            background-color: #f59e0b;
            color: white;
        }
        .status-Inactive {
            background-color: #ef4444;
            color: white;
        }
        .resolved {
            color: #10b981;
            font-weight: bold;
        }
        .open {
            color: #ef4444;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Clario Driving School</h1>
            <p>Vehicle Information Report</p>
        </div>

        <div class="title">
            VEHICLE DETAILS
        </div>

        <div class="vehicle-info">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Vehicle:</span>
                    <span>{{ $vehicle->brand }} {{ $vehicle->model }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Plate Number:</span>
                    <span>{{ $vehicle->plate }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Year:</span>
                    <span>{{ $vehicle->year }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Category:</span>
                    <span>{{ $vehicle->category }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">VIN:</span>
                    <span>{{ $vehicle->vin ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-badge status-{{ $vehicle->status }}">{{ $vehicle->status }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Fuel Type:</span>
                    <span>{{ $vehicle->fuel }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Transmission:</span>
                    <span>{{ $vehicle->transmission }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Color:</span>
                    <span>{{ $vehicle->color ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Current Mileage:</span>
                    <span>{{ number_format($vehicle->mileage) }} km</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Assigned Instructor:</span>
                    <span>{{ $vehicle->assigned_instructor ?? '—' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Sessions:</span>
                    <span>{{ $vehicle->sessions_count }}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Financial Information</div>
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Purchase Price:</span>
                    <span>{{ number_format($vehicle->purchase_price ?? 0, 2) }} MAD</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Current Value:</span>
                    <span>{{ number_format($vehicle->current_value ?? 0, 2) }} MAD</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Depreciation:</span>
                    <span>
                        @php
                            $depreciation = 0;
                            if ($vehicle->purchase_price && $vehicle->purchase_price > 0) {
                                $currentValue = $vehicle->current_value ?? 0;
                                $depreciation = round((1 - $currentValue / $vehicle->purchase_price) * 100);
                            }
                        @endphp
                        {{ $depreciation }}%
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Fuel Efficiency:</span>
                    <span>{{ $vehicle->fuel_efficiency ? number_format($vehicle->fuel_efficiency, 1) . ' L/100km' : 'N/A' }}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Insurance & Compliance</div>
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Insurance Provider:</span>
                    <span>{{ $vehicle->insurance_provider ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Insurance Policy:</span>
                    <span>{{ $vehicle->insurance_policy ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Insurance Expiry:</span>
                    <span>{{ $vehicle->insurance_expiry ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Technical Inspection:</span>
                    <span>{{ $vehicle->technical_inspection ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Registration Expiry:</span>
                    <span>{{ $vehicle->registration_expiry ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Last Maintenance:</span>
                    <span>{{ $vehicle->last_maintenance ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Next Maintenance:</span>
                    <span>{{ $vehicle->next_maintenance ?? 'N/A' }}</span>
                </div>
            </div>
        </div>

        @if($vehicle->notes)
        <div class="section">
            <div class="section-title">Notes</div>
            <p>{{ $vehicle->notes }}</p>
        </div>
        @endif

        @if($vehicle->maintenance_history && count($vehicle->maintenance_history) > 0)
        <div class="section">
            <div class="section-title">Maintenance History ({{ count($vehicle->maintenance_history) }} records)</div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Mileage</th>
                        <th>Cost (MAD)</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($vehicle->maintenance_history as $record)
                    <tr>
                        <td>{{ $record['date'] }}</td>
                        <td>{{ $record['type'] }}</td>
                        <td>{{ number_format($record['mileage']) }} km</td>
                        <td>{{ number_format($record['cost'], 2) }}</td>
                        <td>{{ $record['notes'] ?? '—' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        @if($vehicle->incidents && count($vehicle->incidents) > 0)
        <div class="section">
            <div class="section-title">Incident Reports ({{ count($vehicle->incidents) }} records)</div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Cost (MAD)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($vehicle->incidents as $incident)
                    <tr>
                        <td>{{ $incident['date'] }}</td>
                        <td>{{ $incident['type'] }}</td>
                        <td>{{ $incident['description'] }}</td>
                        <td>{{ number_format($incident['cost'], 2) }}</td>
                        <td><span class="{{ $incident['resolved'] ? 'resolved' : 'open' }}">{{ $incident['resolved'] ? 'Resolved' : 'Open' }}</span></td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <div class="footer">
            <p>Report generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
            <p>Clario Driving School - Fleet Management System</p>
        </div>
    </div>
</body>
</html>
