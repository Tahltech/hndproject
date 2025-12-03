<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role as SpatieRole;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');

    // Truncate the table
    DB::table('roles')->truncate();

    // Re-enable foreign key checks
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $roles = [
            'user',
            'agent',
            'support_officer',
            'accountant',
            'loan_officer',
            'branch_manager',
            'overall_admin',
            'it_admin',
        ];

        foreach ($roles as $roleName) {

            // Insert into your own roles table if it doesn’t exist
            DB::table('roles')->updateOrInsert(
                ['role_name' => $roleName],
                ['created_at' => now(), 'updated_at' => now()]
            );

            // Insert into Spatie’s roles table if it doesn’t exist
            SpatieRole::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);
        }
    }
}
