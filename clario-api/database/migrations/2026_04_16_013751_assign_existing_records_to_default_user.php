// php artisan make:migration assign_existing_records_to_default_user
<?php

use App\Models\User;
use App\Models\Student;
use App\Models\Instructor;
use App\Models\Vehicle;
use App\Models\Session;
use App\Models\Payment;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up()
    {
        // Get the first user or create a default one
        $defaultUser = User::first();

        if ($defaultUser) {
            // Assign all existing records to the default user
            Student::whereNull('user_id')->update(['user_id' => $defaultUser->id]);
            Instructor::whereNull('user_id')->update(['user_id' => $defaultUser->id]);
            Vehicle::whereNull('user_id')->update(['user_id' => $defaultUser->id]);
            Session::whereNull('user_id')->update(['user_id' => $defaultUser->id]);
            Payment::whereNull('user_id')->update(['user_id' => $defaultUser->id]);
        }
    }

    public function down()
    {
        // No need to reverse
    }
};
