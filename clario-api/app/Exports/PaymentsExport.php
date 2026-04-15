<?php

namespace App\Exports;

use App\Models\Payment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PaymentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $payments;

    public function __construct($payments = null)
    {
        $this->payments = $payments;
    }

    public function collection()
    {
        return $this->payments ?? Payment::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Reference',
            'Student/Expense Name',
            'Student CIN',
            'Student Phone',
            'Student Email',
            'Category',
            'Payment Category',
            'Total Amount (DH)',
            'Paid Amount (DH)',
            'Remaining Amount (DH)',
            'Status',
            'Payment Method',
            'Payment Type',
            'Date',
            'Due Date',
            'Instructor',
            'Notes',
            'Transaction Reference',
            'Receipt Number',
            'Vehicle ID',
            'Created At',
        ];
    }

    public function map($payment): array
    {
        $isExpense = in_array($payment->type, ['Maintenance', 'Incident']);

        return [
            $payment->id,
            $payment->reference,
            $payment->student_name,
            $payment->student_cin,
            $payment->student_phone ?? 'N/A',
            $payment->student_email ?? 'N/A',
            $payment->category,
            $payment->payment_category ?? 'N/A',
            number_format($payment->amount_total, 2),
            number_format($payment->amount_paid, 2),
            number_format($payment->amount_remaining, 2),
            $payment->status,
            $payment->method,
            $payment->type,
            $payment->date,
            $payment->due_date ?? 'N/A',
            $isExpense ? 'System' : ($payment->instructor ?? 'N/A'),
            $payment->notes ?? 'N/A',
            $payment->payment_reference ?? 'N/A',
            $payment->receipt_number ?? 'N/A',
            $payment->vehicle_id ?? 'N/A',
            $payment->created_at->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Style for expense rows (optional - can be applied after export)
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }
}
