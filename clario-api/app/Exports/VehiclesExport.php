<?php

namespace App\Exports;

use App\Models\Vehicle;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class VehiclesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $vehicles;

    public function __construct($vehicles = null)
    {
        $this->vehicles = $vehicles;
    }

    public function collection()
    {
        return $this->vehicles ?? Vehicle::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Brand',
            'Model',
            'Year',
            'Plate Number',
            'VIN',
            'Category',
            'Fuel Type',
            'Transmission',
            'Color',
            'Status',
            'Mileage (km)',
            'Last Maintenance',
            'Next Maintenance',
            'Insurance Expiry',
            'Insurance Provider',
            'Insurance Policy',
            'Technical Inspection',
            'Registration Expiry',
            'Assigned Instructor',
            'Sessions Count',
            'Maintenance Records Count',
            'Incidents Count',
            'Purchase Price (MAD)',
            'Current Value (MAD)',
            'Depreciation (%)',
            'Fuel Efficiency (L/100km)',
            'Notes',
            'Created At',
        ];
    }

    public function map($vehicle): array
    {
        $depreciation = 0;
        if ($vehicle->purchase_price && $vehicle->purchase_price > 0) {
            $currentValue = $vehicle->current_value ?? 0;
            $depreciation = round((1 - $currentValue / $vehicle->purchase_price) * 100);
        }

        $maintenanceCount = is_array($vehicle->maintenance_history) ? count($vehicle->maintenance_history) : 0;
        $incidentsCount = is_array($vehicle->incidents) ? count($vehicle->incidents) : 0;

        return [
            $vehicle->id,
            $vehicle->brand,
            $vehicle->model,
            $vehicle->year,
            $vehicle->plate,
            $vehicle->vin ?? 'N/A',
            $vehicle->category,
            $vehicle->fuel,
            $vehicle->transmission,
            $vehicle->color ?? 'N/A',
            $vehicle->status,
            number_format($vehicle->mileage),
            $vehicle->last_maintenance ?? 'N/A',
            $vehicle->next_maintenance ?? 'N/A',
            $vehicle->insurance_expiry ?? 'N/A',
            $vehicle->insurance_provider ?? 'N/A',
            $vehicle->insurance_policy ?? 'N/A',
            $vehicle->technical_inspection ?? 'N/A',
            $vehicle->registration_expiry ?? 'N/A',
            $vehicle->assigned_instructor ?? 'N/A',
            $vehicle->sessions_count,
            $maintenanceCount,
            $incidentsCount,
            $vehicle->purchase_price ? number_format($vehicle->purchase_price, 2) : 'N/A',
            $vehicle->current_value ? number_format($vehicle->current_value, 2) : 'N/A',
            $depreciation . '%',
            $vehicle->fuel_efficiency ? number_format($vehicle->fuel_efficiency, 1) : 'N/A',
            $vehicle->notes ?? 'N/A',
            $vehicle->created_at ? $vehicle->created_at->format('Y-m-d H:i:s') : 'N/A',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => '0D0D0D']]],
            1 => ['fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '8CFF2E']]],
        ];
    }
}
