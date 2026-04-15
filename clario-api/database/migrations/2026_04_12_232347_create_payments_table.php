<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();

            // Foreign keys (nullable for flexibility)
            $table->foreignId('student_id')->nullable()->constrained('students')->onDelete('set null');
            $table->foreignId('session_id')->nullable()->constrained('driving_sessions')->onDelete('set null');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->onDelete('set null');

            // Student information (denormalized for history)
            $table->string('student_name');
            $table->string('student_cin');
            $table->string('student_phone')->nullable();
            $table->string('student_email')->nullable();

            // Payment classification
            $table->string('category');
            $table->enum('payment_category', ['registration', 'session', 'exam', 'vehicle_maintenance', 'vehicle_incident'])->default('registration');

            // Amount fields
            $table->decimal('amount_total', 10, 2);
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->decimal('amount_remaining', 10, 2);

            // Status and method
            $table->enum('status', ['Paid', 'Partial', 'Pending', 'Overdue'])->default('Pending');
            $table->string('method')->default('Cash');
            $table->string('type');

            // Dates
            $table->date('date');
            $table->date('due_date')->nullable();

            // Additional info
            $table->string('instructor')->nullable();
            $table->text('notes')->nullable();
            $table->string('receipt_number')->nullable();
            $table->string('payment_reference')->nullable();

            $table->timestamps();

            // Add indexes for better performance
            $table->index('student_id');
            $table->index('session_id');
            $table->index('vehicle_id');
            $table->index('status');
            $table->index('payment_category');
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
