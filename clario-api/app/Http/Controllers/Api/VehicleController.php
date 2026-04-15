<?php

namespace App\Http\Controllers\Api;

use App\Exports\VehiclesExport;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $vehicles = Vehicle::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $vehicles,
                'message' => 'Vehicles retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load vehicles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'brand' => 'required|string|max:255',
                'model' => 'required|string|max:255',
                'year' => 'required|integer|min:1990|max:' . (date('Y') + 1),
                'plate' => 'required|string|unique:vehicles',
                'vin' => 'nullable|string|unique:vehicles',
                'category' => 'required|string|in:B,A,A1,C,D,BE',
                'fuel' => 'required|string|in:Gasoline,Diesel,Electric,Hybrid,LPG',
                'transmission' => 'required|string|in:Manual,Automatic',
                'color' => 'nullable|string',
                'status' => 'required|in:Active,Maintenance,Inactive,Out of Service',
                'mileage' => 'nullable|integer|min:0',
                'last_maintenance' => 'nullable|date',
                'next_maintenance' => 'nullable|date|after:last_maintenance',
                'insurance_expiry' => 'nullable|date',
                'insurance_provider' => 'nullable|string|max:255',
                'insurance_policy' => 'nullable|string|max:255',
                'technical_inspection' => 'nullable|date',
                'registration_expiry' => 'nullable|date',
                'assigned_instructor' => 'nullable|string|max:255',
                'purchase_price' => 'nullable|numeric|min:0',
                'current_value' => 'nullable|numeric|min:0',
                'fuel_efficiency' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            $vehicle = Vehicle::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle created successfully',
                'data' => $vehicle
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $vehicle = Vehicle::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $vehicle
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Vehicle not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $vehicle = Vehicle::findOrFail($id);

            $validated = $request->validate([
                'brand' => 'sometimes|string|max:255',
                'model' => 'sometimes|string|max:255',
                'year' => 'sometimes|integer|min:1990|max:' . (date('Y') + 1),
                'plate' => ['sometimes', 'string', Rule::unique('vehicles')->ignore($id)],
                'vin' => ['nullable', 'string', Rule::unique('vehicles')->ignore($id)],
                'category' => 'sometimes|string|in:B,A,A1,C,D,BE',
                'fuel' => 'sometimes|string|in:Gasoline,Diesel,Electric,Hybrid,LPG',
                'transmission' => 'sometimes|string|in:Manual,Automatic',
                'color' => 'nullable|string',
                'status' => 'sometimes|in:Active,Maintenance,Inactive,Out of Service',
                'mileage' => 'nullable|integer|min:0',
                'last_maintenance' => 'nullable|date',
                'next_maintenance' => 'nullable|date',
                'insurance_expiry' => 'nullable|date',
                'insurance_provider' => 'nullable|string|max:255',
                'insurance_policy' => 'nullable|string|max:255',
                'technical_inspection' => 'nullable|date',
                'registration_expiry' => 'nullable|date',
                'assigned_instructor' => 'nullable|string|max:255',
                'purchase_price' => 'nullable|numeric|min:0',
                'current_value' => 'nullable|numeric|min:0',
                'fuel_efficiency' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            $vehicle->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle updated successfully',
                'data' => $vehicle
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $vehicle = Vehicle::findOrFail($id);
            $vehicle->delete();

            return response()->json([
                'success' => true,
                'message' => 'Vehicle deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete vehicle: ' . $e->getMessage()
            ], 500);
        }
    }

  /**
 * Add maintenance record to vehicle
 */
public function addMaintenance(Request $request, $id)
{
    DB::beginTransaction();

    try {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|string',
            'mileage' => 'required|integer|min:0',
            'cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Add maintenance record to vehicle
        $maintenanceHistory = $vehicle->maintenance_history ?? [];
        $newRecord = [
            'id' => time(),
            'date' => $validated['date'],
            'type' => $validated['type'],
            'mileage' => $validated['mileage'],
            'cost' => $validated['cost'] ?? 0,
            'notes' => $validated['notes'] ?? '',
        ];

        $maintenanceHistory[] = $newRecord;
        $vehicle->maintenance_history = $maintenanceHistory;
        $vehicle->last_maintenance = $validated['date'];

        // Set next maintenance date based on maintenance type
        $nextMaintenanceDate = $this->calculateNextMaintenanceDate($validated['date'], $validated['type']);
        $vehicle->next_maintenance = $nextMaintenanceDate;

        // Always set vehicle to Maintenance status when a maintenance record is added.
        // Use the completeMaintenance endpoint to return the vehicle to Active status.
        // Optionally controlled by the frontend's set_maintenance_status flag.
        if ($request->input('set_maintenance_status', true)) {
            $vehicle->status = 'Maintenance';
        }

        // Update mileage
        if ($validated['mileage'] > $vehicle->mileage) {
            $vehicle->mileage = $validated['mileage'];
        }

        $vehicle->save();

        // CREATE PAYMENT RECORD FOR MAINTENANCE COST
        if (($validated['cost'] ?? 0) > 0) {
            $paymentData = [
                'reference' => $this->generateUniquePaymentReference(),
                'vehicle_id' => $vehicle->id,
                'student_name' => 'MAINTENANCE',
                'student_cin' => 'SYS-MAINT',
                'category' => $vehicle->category,
                'payment_category' => 'vehicle_maintenance',
                'amount_total' => $validated['cost'],
                'amount_paid' => $validated['cost'],
                'amount_remaining' => 0,
                'status' => 'Paid',
                'method' => 'Cash',
                'type' => 'Maintenance',
                'date' => $validated['date'],
                'due_date' => $validated['date'],
                'instructor' => $vehicle->assigned_instructor ?? 'System',
                'notes' => 'Maintenance: ' . $validated['type'],
                'receipt_number' => 'MAINT-' . str_pad($vehicle->id, 6, '0', STR_PAD_LEFT),
                'payment_reference' => 'MAINT-' . $vehicle->id . '-' . time(),
            ];
            Payment::create($paymentData);
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Maintenance record added successfully. Vehicle status: ' . $vehicle->status,
            'data' => $vehicle
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Failed to add maintenance record: ' . $e->getMessage()
        ], 500);
    }
}

/**
 * Calculate next maintenance date based on maintenance type
 */
private function calculateNextMaintenanceDate($currentDate, $maintenanceType)
{
    $date = new DateTime($currentDate);

    switch ($maintenanceType) {
        case 'Oil Change':
            $date->modify('+3 months');
            break;
        case 'Tire Rotation':
            $date->modify('+6 months');
            break;
        case 'Brake Service':
            $date->modify('+12 months');
            break;
        case 'Engine Tune-up':
            $date->modify('+12 months');
            break;
        case 'Transmission Service':
            $date->modify('+24 months');
            break;
        case 'Battery Replacement':
            $date->modify('+36 months');
            break;
        case 'Inspection':
            $date->modify('+12 months');
            break;
        default:
            $date->modify('+3 months');
            break;
    }

    return $date->format('Y-m-d');
}

    /**
     * Add document to vehicle
     */
    public function addDocument(Request $request, $id)
    {
        try {
            $vehicle = Vehicle::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string',
                'type' => 'required|string',
                'expiry_date' => 'nullable|date',
                'file_name' => 'nullable|string',
            ]);

            $documents = $vehicle->documents ?? [];
            $newDocument = [
                'id' => time(),
                'name' => $validated['name'],
                'type' => $validated['type'],
                'expiry_date' => $validated['expiry_date'] ?? null,
                'upload_date' => now()->toDateString(),
                'file_name' => $validated['file_name'] ?? 'document.pdf',
            ];

            $documents[] = $newDocument;
            $vehicle->documents = $documents;
            $vehicle->save();

            return response()->json([
                'success' => true,
                'message' => 'Document added successfully',
                'data' => $vehicle
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add document: ' . $e->getMessage()
            ], 500);
        }
    }

   public function addIncident(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $vehicle = Vehicle::findOrFail($id);

            $validated = $request->validate([
                'date' => 'required|date',
                'type' => 'required|string',
                'description' => 'required|string',
                'cost' => 'nullable|numeric|min:0',
                'reported_by' => 'nullable|string',
                'resolved' => 'boolean',
            ]);

            $incidents = $vehicle->incidents ?? [];
            $newIncident = [
                'id' => time(),
                'date' => $validated['date'],
                'type' => $validated['type'],
                'description' => $validated['description'],
                'cost' => $validated['cost'] ?? 0,
                'reported_by' => $validated['reported_by'] ?? 'System',
                'resolved' => $validated['resolved'] ?? false,
            ];

            $incidents[] = $newIncident;
            $vehicle->incidents = $incidents;

            // Set vehicle status to Inactive for certain incident types
            $incidentTypesThatRequireInactive = ['Accident', 'Damage', 'Theft'];

            if (in_array($validated['type'], $incidentTypesThatRequireInactive)) {
                $vehicle->status = 'Inactive';
            } else {
                $vehicle->status = 'Maintenance';
            }

            $vehicle->save();

            // Create payment record if cost > 0
            if (($validated['cost'] ?? 0) > 0) {
                $paymentData = [
                    'reference' => $this->generateUniquePaymentReference(),
                    'vehicle_id' => $vehicle->id,
                    'student_name' => 'INCIDENT',
                    'student_cin' => 'SYS-INCID',
                    'category' => $vehicle->category,
                    'payment_category' => 'vehicle_incident',
                    'amount_total' => $validated['cost'],
                    'amount_paid' => $validated['cost'],
                    'amount_remaining' => 0,
                    'status' => 'Paid',
                    'method' => 'Cash',
                    'type' => 'Incident',
                    'date' => $validated['date'],
                    'due_date' => $validated['date'],
                    'instructor' => $vehicle->assigned_instructor ?? 'System',
                    'notes' => 'Incident: ' . $validated['type'] . ' - ' . $validated['description'],
                    'receipt_number' => 'INCID-' . str_pad($vehicle->id, 6, '0', STR_PAD_LEFT),
                    'payment_reference' => 'INCID-' . $vehicle->id . '-' . time(),
                ];
                Payment::create($paymentData);
            }

            DB::commit();

            $updatedVehicle = Vehicle::find($vehicle->id);
            $updatedVehicle->incidents = array_values($updatedVehicle->incidents ?? []);

            return response()->json([
                'success' => true,
                'message' => 'Incident reported successfully. Vehicle status: ' . $vehicle->status,
                'data' => $updatedVehicle,
                'payment_created' => ($validated['cost'] ?? 0) > 0
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to report incident: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
 * Resolve an incident and set vehicle back to Active
 */
public function resolveIncident(Request $request, $id)
{
    DB::beginTransaction();

    try {
        $vehicle = Vehicle::findOrFail($id);
        $incidentId = $request->input('incident_id');

        $incidents = $vehicle->incidents ?? [];
        $incidentFound = false;

        // Find and update the incident
        foreach ($incidents as &$incident) {
            if ($incident['id'] == $incidentId) {
                $incident['resolved'] = true;
                $incident['resolved_date'] = now()->toDateString();
                $incident['resolved_by'] = $request->input('resolved_by', 'System');
                $incidentFound = true;
                break;
            }
        }

        if (!$incidentFound) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Incident not found'
            ], 404);
        }

        // Check if all incidents are resolved
        $allResolved = true;
        foreach ($incidents as $incident) {
            if (!$incident['resolved']) {
                $allResolved = false;
                break;
            }
        }

        // If all incidents are resolved, set vehicle status back to Active
        if ($allResolved) {
            $vehicle->status = 'Active';
        }

        $vehicle->incidents = $incidents;
        $vehicle->save();

        DB::commit();

        // Refresh vehicle data
        $updatedVehicle = Vehicle::find($vehicle->id);
        $updatedVehicle->incidents = array_values($updatedVehicle->incidents ?? []);

        return response()->json([
            'success' => true,
            'message' => $allResolved ? 'Incident resolved. Vehicle is now Active.' : 'Incident marked as resolved.',
            'data' => $updatedVehicle
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Failed to resolve incident: ' . $e->getMessage()
        ], 500);
    }
}
    /**
     * Export vehicles to Excel
     */
    public function exportExcel(Request $request)
    {
        try {
            $query = Vehicle::query();

            // Apply filters
            if ($request->has('category') && $request->category !== 'All') {
                $query->where('category', $request->category);
            }

            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('brand', 'like', "%{$search}%")
                      ->orWhere('model', 'like', "%{$search}%")
                      ->orWhere('plate', 'like', "%{$search}%")
                      ->orWhere('vin', 'like', "%{$search}%")
                      ->orWhere('assigned_instructor', 'like', "%{$search}%");
                });
            }

            $vehicles = $query->orderBy('created_at', 'desc')->get();

            $export = new VehiclesExport($vehicles);
            $filename = 'vehicles_' . date('Y-m-d_His') . '.xlsx';

            return Excel::download($export, $filename);
        } catch (\Exception $e) {
            Log::error('Excel export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export vehicles to CSV
     */
    public function exportCsv(Request $request)
    {
        try {
            $query = Vehicle::query();

            // Apply filters
            if ($request->has('category') && $request->category !== 'All') {
                $query->where('category', $request->category);
            }

            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('brand', 'like', "%{$search}%")
                      ->orWhere('model', 'like', "%{$search}%")
                      ->orWhere('plate', 'like', "%{$search}%")
                      ->orWhere('vin', 'like', "%{$search}%")
                      ->orWhere('assigned_instructor', 'like', "%{$search}%");
                });
            }

            $vehicles = $query->orderBy('created_at', 'desc')->get();

            $export = new VehiclesExport($vehicles);
            $filename = 'vehicles_' . date('Y-m-d_His') . '.csv';

            return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::CSV);
        } catch (\Exception $e) {
            Log::error('CSV export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export vehicles to PDF
     */
    public function exportPdf(Request $request)
    {
        try {
            $query = Vehicle::query();

            // Apply filters
            if ($request->has('category') && $request->category !== 'All') {
                $query->where('category', $request->category);
            }

            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('brand', 'like', "%{$search}%")
                      ->orWhere('model', 'like', "%{$search}%")
                      ->orWhere('plate', 'like', "%{$search}%")
                      ->orWhere('vin', 'like', "%{$search}%")
                      ->orWhere('assigned_instructor', 'like', "%{$search}%");
                });
            }

            $vehicles = $query->orderBy('created_at', 'desc')->get();

            $totalVehicles = $vehicles->count();
            $activeVehicles = $vehicles->where('status', 'Active')->count();
            $maintenanceVehicles = $vehicles->where('status', 'Maintenance')->count();
            $totalValue = $vehicles->sum(function($v) {
                return $v->current_value ?? $v->purchase_price ?? 0;
            });
            $totalMileage = $vehicles->sum('mileage');

            $pdf = Pdf::loadView('exports.vehicles-pdf', [
                'vehicles' => $vehicles,
                'totalVehicles' => $totalVehicles,
                'activeVehicles' => $activeVehicles,
                'maintenanceVehicles' => $maintenanceVehicles,
                'totalValue' => $totalValue,
                'totalMileage' => $totalMileage,
                'exportDate' => now()->format('Y-m-d H:i:s')
            ]);

            $pdf->setPaper('A4', 'landscape');

            return $pdf->download('vehicles_' . date('Y-m-d_His') . '.pdf');
        } catch (\Exception $e) {
            Log::error('PDF export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export single vehicle details to PDF
     */
    public function exportVehiclePdf($id)
    {
        try {
            $vehicle = Vehicle::findOrFail($id);

            $pdf = Pdf::loadView('exports.vehicle-detail-pdf', ['vehicle' => $vehicle]);
            $pdf->setPaper('A4', 'portrait');

            return $pdf->download('vehicle_' . $vehicle->plate . '_' . date('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            Log::error('Vehicle PDF export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
 * Generate unique payment reference
 */
private function generateUniquePaymentReference()
{
    $year = date('Y');
    $maxAttempts = 10;

    for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
        $lastPayment = Payment::orderBy('id', 'desc')->first();
        $nextNumber = ($lastPayment ? $lastPayment->id + 1 : 1);
        $reference = 'PAY-' . $year . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        if (!Payment::where('reference', $reference)->exists()) {
            return $reference;
        }

        $randomRef = 'PAY-' . $year . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        if (!Payment::where('reference', $randomRef)->exists()) {
            return $randomRef;
        }
    }

    return 'PAY-' . $year . '-' . time();
}
/**
 * Check and update vehicle status based on maintenance schedule
 */
public function updateMaintenanceStatus()
{
    try {
        $today = date('Y-m-d');
        $updatedVehicles = [];

        // Get all vehicles
        $vehicles = Vehicle::all();

        foreach ($vehicles as $vehicle) {
            $oldStatus = $vehicle->status;
            $newStatus = $vehicle->status;

            // Check if vehicle has a next_maintenance date
            if ($vehicle->next_maintenance) {
                $maintenanceDate = $vehicle->next_maintenance;
                $daysUntilMaintenance = ceil((strtotime($maintenanceDate) - strtotime($today)) / 86400);

                // If maintenance date is today or passed, set to Maintenance
                if ($daysUntilMaintenance <= 0 && $vehicle->status === 'Active') {
                    $newStatus = 'Maintenance';
                }
                // If maintenance is overdue and already in maintenance, keep it
                elseif ($daysUntilMaintenance <= 0 && $vehicle->status === 'Maintenance') {
                    $newStatus = 'Maintenance';
                }
                // If maintenance is completed (has last_maintenance after next_maintenance)
                elseif ($vehicle->last_maintenance && $vehicle->last_maintenance >= $vehicle->next_maintenance) {
                    $newStatus = 'Active';
                }
            }

            // Update status if changed
            if ($newStatus !== $oldStatus) {
                $vehicle->status = $newStatus;
                $vehicle->save();
                $updatedVehicles[] = [
                    'id' => $vehicle->id,
                    'name' => $vehicle->brand . ' ' . $vehicle->model,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'next_maintenance' => $vehicle->next_maintenance
                ];
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Vehicle maintenance status updated',
            'data' => [
                'updated_count' => count($updatedVehicles),
                'updated_vehicles' => $updatedVehicles
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to update maintenance status: ' . $e->getMessage()
        ], 500);
    }
}

/**
 * Mark maintenance as completed and return vehicle to active
 */
public function completeMaintenance(Request $request, $id)
{
    DB::beginTransaction();

    try {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'completion_date' => 'required|date',
            'notes' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
        ]);

        // Update vehicle status to Active
        $vehicle->status = 'Active';

        // Update last_maintenance date
        $vehicle->last_maintenance = $validated['completion_date'];

        // Set next maintenance date (e.g., 3 months or 5000km from now)
        $nextMaintenanceDate = date('Y-m-d', strtotime($validated['completion_date'] . ' + 3 months'));
        $vehicle->next_maintenance = $nextMaintenanceDate;

        $vehicle->save();

        // Add completion record to maintenance history
        $maintenanceHistory = $vehicle->maintenance_history ?? [];
        $completionRecord = [
            'id' => time(),
            'date' => $validated['completion_date'],
            'type' => 'Maintenance Completed',
            'mileage' => $vehicle->mileage,
            'cost' => $validated['cost'] ?? 0,
            'notes' => 'Maintenance completed: ' . ($validated['notes'] ?? 'Vehicle returned to active status'),
            'status_change' => 'Maintenance → Active'
        ];

        $maintenanceHistory[] = $completionRecord;
        $vehicle->maintenance_history = $maintenanceHistory;
        $vehicle->save();

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Maintenance completed and vehicle returned to active status',
            'data' => $vehicle
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Failed to complete maintenance: ' . $e->getMessage()
        ], 500);
    }
}
}
