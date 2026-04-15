<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\VehicleController;

class UpdateVehicleMaintenanceStatus extends Command
{
    protected $signature = 'vehicles:update-maintenance';
    protected $description = 'Update vehicle maintenance status based on next_maintenance date';

    public function handle(VehicleController $vehicleController)
    {
        $response = $vehicleController->updateMaintenanceStatus();
        $this->info('Vehicle maintenance status updated successfully');
        return Command::SUCCESS;
    }
}
