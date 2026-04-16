// database/migrations/xxxx_xx_xx_xxxxxx_fix_stripe_session_id_in_pending_users.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pending_users', function (Blueprint $table) {
            // Make stripe_session_id nullable
            $table->string('stripe_session_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pending_users', function (Blueprint $table) {
            $table->string('stripe_session_id')->nullable(false)->change();
        });
    }
};
