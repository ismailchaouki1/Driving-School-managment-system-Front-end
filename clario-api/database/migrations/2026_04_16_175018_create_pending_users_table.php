<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pending_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('stripe_session_id')->unique();
            $table->string('plan_selected');
            $table->string('billing_cycle');
            $table->timestamp('expires_at')->default(now()->addHours(24));
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pending_users');
    }
};
