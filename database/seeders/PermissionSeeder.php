<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Step 1: Define all your dashboards as permissions
        $permissions = [
            'view_dashboard_user',
            'view_dashboard_agent',
            'view_dashboard_support_officer',
            'view_dashboard_accountant',
            'view_dashboard_loan_officer',
            'view_dashboard_branch_manager',
            'view_dashboard_overall_admin',
            'view_dashboard_it_admin',
        ];

        // Step 2: Create each permission
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Step 3: Assign each role its own dashboard permission
        $roles = [
            'user' => 'view_dashboard_user',
            'agent' => 'view_dashboard_agent',
            'support_officer' => 'view_dashboard_support_officer',
            'accountant' => 'view_dashboard_accountant',
            'loan_officer' => 'view_dashboard_loan_officer',
            'branch_manager' => 'view_dashboard_branch_manager',
            'overall_admin' => 'view_dashboard_overall_admin',
            'it_admin' => 'view_dashboard_it_admin',
        ];

        foreach ($roles as $roleName => $permissionName) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $role->givePermissionTo($permissionName);
            }
        }
    }
}

