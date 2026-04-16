<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Exports\StudentsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class StudentController extends Controller
{
    public function index()
    {
        try {
            // ✅ USE ELOQUENT MODEL, NOT DB FACADE
            $students = Student::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $students,
                'message' => 'Students retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load students: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
{
    try {
        Log::info('Creating student with data:', $request->all());

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'cin' => 'required|string|unique:students',
            'age' => 'required|integer|min:16',
            'email' => 'required|email|unique:students',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'type' => 'required|string',
            'initial_payment' => 'nullable|numeric|min:0',
            'total_price' => 'nullable|numeric|min:0',
            'payment_status' => 'required|in:Complete,Partial,Pending',
            'registration_date' => 'required|date',
            'parent_name' => 'nullable|string|max:255',
            'emergency_contact' => 'nullable|string|max:20',
        ]);

        // MANUALLY SET user_id - IMPORTANT!
        $validated['user_id'] = $request->user()->id;

        $student = Student::create($validated);

        // Create payment record if initial payment > 0
        if (($validated['initial_payment'] ?? 0) > 0) {
            $reference = 'PAY-' . date('Y') . '-' . str_pad(DB::table('payments')->count() + 1, 3, '0', STR_PAD_LEFT);

            DB::table('payments')->insert([
                'reference' => $reference,
                'user_id' => $request->user()->id, // MANUALLY SET user_id
                'student_id' => $student->id,
                'student_name' => $student->first_name . ' ' . $student->last_name,
                'student_cin' => $student->cin,
                'student_phone' => $student->phone,
                'student_email' => $student->email,
                'category' => $student->type,
                'payment_category' => 'registration',
                'amount_total' => $validated['total_price'] ?? 0,
                'amount_paid' => $validated['initial_payment'],
                'amount_remaining' => ($validated['total_price'] ?? 0) - $validated['initial_payment'],
                'status' => $validated['initial_payment'] >= ($validated['total_price'] ?? 0) ? 'Paid' : 'Partial',
                'method' => 'Cash',
                'type' => 'Registration',
                'date' => now()->toDateString(),
                'due_date' => now()->addMonths(3)->toDateString(),
                'instructor' => $request->instructor ?? 'System',
                'notes' => 'Initial registration payment',
                'receipt_number' => 'RCP-' . str_pad($student->id, 6, '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data' => $student
        ], 201);
    } catch (\Exception $e) {
        Log::error('Failed to create student: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to create student: ' . $e->getMessage()
        ], 500);
    }
}

    public function show($id)
    {
        try {
            $student = Student::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $student
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $student = Student::findOrFail($id);

            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'cin' => ['sometimes', 'string', Rule::unique('students')->ignore($id)],
                'age' => 'sometimes|integer|min:16',
                'email' => ['sometimes', 'email', Rule::unique('students')->ignore($id)],
                'phone' => 'sometimes|string|max:20',
                'address' => 'nullable|string',
                'type' => 'sometimes|string',
                'initial_payment' => 'nullable|numeric|min:0',
                'total_price' => 'nullable|numeric|min:0',
                'payment_status' => 'sometimes|in:Complete,Partial,Pending',
                'registration_date' => 'sometimes|date',
                'parent_name' => 'nullable|string|max:255',
                'emergency_contact' => 'nullable|string|max:20',
            ]);

            $student->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Student updated successfully',
                'data' => $student
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update student: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $student = Student::findOrFail($id);
            $student->delete();

            return response()->json([
                'success' => true,
                'message' => 'Student deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete student: ' . $e->getMessage()
            ], 500);
        }
    }
    public function exportExcel(Request $request)
{
    try {
        $students = Student::all();
        $export = new StudentsExport($students);
        return Excel::download($export, 'students_' . date('Y-m-d') . '.xlsx');
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Export failed: ' . $e->getMessage()
        ], 500);
    }
}

public function exportPdf(Request $request)
{
    try {
        $students = Student::all();
        $pdf = Pdf::loadView('exports.students-pdf', ['students' => $students]);
        return $pdf->download('students_' . date('Y-m-d') . '.pdf');
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Export failed: ' . $e->getMessage()
        ], 500);
    }
}
public function printReceipt($id)
{
    try {
        $student = Student::findOrFail($id);
        $pdf = Pdf::loadView('exports.student-receipt', ['student' => $student]);
        return $pdf->download('receipt_' . $student->cin . '_' . date('Y-m-d') . '.pdf');
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to generate receipt: ' . $e->getMessage()
        ], 500);
    }
}
}
