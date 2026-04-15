<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Add payment_category column if it doesn't exist
            if (!Schema::hasColumn('payments', 'payment_category')) {
                $table->enum('payment_category', [
                    'registration',
                    'session',
                    'exam',
                    'vehicle_maintenance',
                    'vehicle_incident'
                ])->default('registration')->after('category');

                // Only add index if we just created the column
                $table->index('payment_category');
                $table->index(['payment_category', 'date']);
            }

            // Add vehicle_id column if it doesn't exist
            if (!Schema::hasColumn('payments', 'vehicle_id')) {
                $table->unsignedBigInteger('vehicle_id')->nullable()->after('session_id');

                // Add foreign key constraint only if vehicles table exists
                if (Schema::hasTable('vehicles')) {
                    $table->foreign('vehicle_id')
                          ->references('id')
                          ->on('vehicles')
                          ->onDelete('set null');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Drop foreign key if exists
            if (Schema::hasTable('vehicles') && Schema::hasColumn('payments', 'vehicle_id')) {
                $table->dropForeign(['vehicle_id']);
            }

            // Drop columns if they exist
            if (Schema::hasColumn('payments', 'payment_category')) {
                $table->dropIndex(['payment_category']);
                $table->dropIndex(['payment_category', 'date']);
                $table->dropColumn('payment_category');
            }

            if (Schema::hasColumn('payments', 'vehicle_id')) {
                $table->dropColumn('vehicle_id');
            }
        });
    }
};
