<?php
// database/migrations/2026_04_16_030000_fix_user_id_constraints.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // First, get a default user to assign to NULL records
        $defaultUser = DB::table('users')->first();

        if (!$defaultUser) {
            // Create a default admin user if none exists
            $defaultUserId = DB::table('users')->insertGetId([
                'name' => 'Default Admin',
                'email' => 'admin@default.com',
                'password' => bcrypt('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $defaultUser = (object)['id' => $defaultUserId];
        }

        // Process each table
        $tables = ['students', 'instructors', 'vehicles', 'driving_sessions', 'payments'];

        foreach ($tables as $table) {
            if (!Schema::hasTable($table)) {
                continue;
            }

            if (!Schema::hasColumn($table, 'user_id')) {
                // Add user_id column if it doesn't exist
                Schema::table($table, function (Blueprint $table) {
                    $table->foreignId('user_id')->nullable()->after('id');
                });
            }

            // Update NULL values to default user
            DB::table($table)->whereNull('user_id')->update(['user_id' => $defaultUser->id]);

            // Make user_id NOT NULL
            DB::statement("ALTER TABLE `{$table}` MODIFY `user_id` BIGINT UNSIGNED NOT NULL");

            // Check if foreign key exists before adding
            $foreignKeyName = "{$table}_user_id_foreign";
            $fkExists = $this->foreignKeyExists($foreignKeyName);

            if (!$fkExists) {
                Schema::table($table, function (Blueprint $table) use ($foreignKeyName) {
                    $table->foreign('user_id', $foreignKeyName)
                          ->references('id')
                          ->on('users')
                          ->onDelete('cascade');
                });
            }
        }
    }

    private function foreignKeyExists($foreignKeyName): bool
    {
        $database = DB::connection()->getDatabaseName();

        $result = DB::select("
            SELECT CONSTRAINT_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE CONSTRAINT_SCHEMA = ?
            AND CONSTRAINT_NAME = ?
        ", [$database, $foreignKeyName]);

        return !empty($result);
    }

    public function down(): void
    {
        // Make columns nullable again but don't drop foreign keys
        $tables = ['students', 'instructors', 'vehicles', 'driving_sessions', 'payments'];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'user_id')) {
                DB::statement("ALTER TABLE `{$table}` MODIFY `user_id` BIGINT UNSIGNED NULL");
            }
        }
    }
};
