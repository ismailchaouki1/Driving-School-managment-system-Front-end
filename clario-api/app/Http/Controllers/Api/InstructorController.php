<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Exports\InstructorsExport;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class InstructorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $instructors = Instructor::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $instructors,
                'message' => 'Instructors retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load instructors: ' . $e->getMessage()
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'cin' => 'required|string|unique:instructors',
            'type' => 'required|in:Code,Driving,Both,Simulator,Evaluation',
            'status' => 'required|in:Active,On Leave,Inactive,Training',
            'experience_level' => 'required|in:Junior,Intermediate,Senior,Master',
            'years_experience' => 'nullable|integer|min:0',
            'hire_date' => 'nullable|date',
            'specialization' => 'nullable|string|max:255',
            'license_number' => 'nullable|string|max:255',
            'available_days' => 'nullable|array',
            'available_hours' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        // Add user_id automatically
        $validated['user_id'] = $request->user()->id;

        // Set default values for stats
        $validated['students_count'] = 0;
        $validated['sessions_count'] = 0;
        $validated['completion_rate'] = 0;
        $validated['rating'] = 0;
        $validated['revenue'] = 0;
        $validated['certifications'] = [];
        $validated['schedule'] = [];
        $validated['documents'] = [];

        $instructor = Instructor::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Instructor created successfully',
            'data' => $instructor
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create instructor: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $instructor = Instructor::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $instructor
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Instructor not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $instructor = Instructor::findOrFail($id);

            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'email' => ['sometimes', 'email', Rule::unique('instructors')->ignore($id)],
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'cin' => ['sometimes', 'string', Rule::unique('instructors')->ignore($id)],
                'type' => 'sometimes|in:Code,Driving,Both,Simulator,Evaluation',
                'status' => 'sometimes|in:Active,On Leave,Inactive,Training',
                'experience_level' => 'sometimes|in:Junior,Intermediate,Senior,Master',
                'years_experience' => 'nullable|integer|min:0',
                'hire_date' => 'nullable|date',
                'specialization' => 'nullable|string|max:255',
                'license_number' => 'nullable|string|max:255',
                'available_days' => 'nullable|array',
                'available_hours' => 'nullable|array',
                'notes' => 'nullable|string',
            ]);

            $instructor->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Instructor updated successfully',
                'data' => $instructor
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update instructor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $instructor = Instructor::findOrFail($id);

            // Check if instructor has associated sessions
            if ($instructor->sessions()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete instructor with associated sessions. Reassign sessions first.'
                ], 422);
            }

            $instructor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Instructor deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete instructor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export instructors to Excel
     */
    public function exportExcel(Request $request)
    {
        try {
            $query = Instructor::query();

            // Apply filters
            if ($request->has('type') && $request->type !== 'All') {
                $query->where('type', $request->type);
            }

            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('cin', 'like', "%{$search}%");
                });
            }

            $instructors = $query->orderBy('created_at', 'desc')->get();

            $export = new InstructorsExport($instructors);
            $filename = 'instructors_' . date('Y-m-d_His') . '.xlsx';

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
     * Export instructors to PDF
     */
    public function exportPdf(Request $request)
    {
        try {
            $query = Instructor::query();

            // Apply filters
            if ($request->has('type') && $request->type !== 'All') {
                $query->where('type', $request->type);
            }

            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('cin', 'like', "%{$search}%");
                });
            }

            $instructors = $query->orderBy('created_at', 'desc')->get();

            $totalInstructors = $instructors->count();
            $activeInstructors = $instructors->where('status', 'Active')->count();
            $totalSessions = $instructors->sum('sessions_count');
            $totalRevenue = $instructors->sum('revenue');
            $avgRating = $totalInstructors > 0 ? $instructors->avg('rating') : 0;

            $pdf = Pdf::loadView('exports.instructors-pdf', [
                'instructors' => $instructors,
                'totalInstructors' => $totalInstructors,
                'activeInstructors' => $activeInstructors,
                'totalSessions' => $totalSessions,
                'totalRevenue' => $totalRevenue,
                'avgRating' => $avgRating,
                'exportDate' => now()->format('Y-m-d H:i:s')
            ]);

            $pdf->setPaper('A4', 'landscape');

            return $pdf->download('instructors_' . date('Y-m-d_His') . '.pdf');
        } catch (\Exception $e) {
            Log::error('PDF export failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
