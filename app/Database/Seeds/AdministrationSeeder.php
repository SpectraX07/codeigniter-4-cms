<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use App\Models\AdministrationModel;

class AdministrationSeeder extends Seeder
{
    public function run()
    {
        $adminModel = new AdministrationModel();

        // Check if Super Admin already exists
        $existingAdmin = $adminModel->where('email', 'superadmin@example.com')->first();
        if ($existingAdmin) {
            echo "Super Admin already exists! Skipping seeding.\n";
            return;
        }

        // Insert Super Admin
        $adminModel->insert([
            'name'              => 'Super Admin',
            'email'             => 'spectraxcodes07@gmail.com',
            'username'          => 'SpectraX07',
            'userType'          => 'Super Admin',
            'password'          => 'SpectraX07',
            'permission'        => json_encode(['all' => true]),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'created_at'        => date('Y-m-d H:i:s'),
            'updated_at'        => date('Y-m-d H:i:s'),
        ]);

        echo "Super Admin seeded successfully!\n";
    }
}
