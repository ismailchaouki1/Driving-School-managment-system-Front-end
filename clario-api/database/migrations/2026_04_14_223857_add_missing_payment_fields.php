<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Only add if column doesn't exist
            if (!Schema::hasColumn('payments', 'payment_category')) {
                $table->enum('payment_category', [
                    'registration', 'session', 'exam',
                    'vehicle_maintenance', 'vehicle_incident'
                ])->default('registration')->after('category');
                $table->index('payment_category');
            }

            if (!Schema::hasColumn('payments', 'vehicle_id')) {
                $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->onDelete('set null');
            }

            // Add method column if missing (from your original migration)
            if (!Schema::hasColumn('payments', 'method')) {
                $table->string('method')->default('Cash')->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'payment_category')) {
                $table->dropColumn('payment_category');
            }
            if (Schema::hasColumn('payments', 'vehicle_id')) {
                $table->dropForeign(['vehicle_id']);
                $table->dropColumn('vehicle_id');
            }
            if (Schema::hasColumn('payments', 'method')) {
                $table->dropColumn('method');
            }
        });
    }
};
