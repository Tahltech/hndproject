<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BankBranchController extends Controller
{

    public function branchStaffs()
    {
        $user = Auth::user();

        if (!$user || !$user->bank_id) {
            return redirect()->route('home');
        }

        $search = request()->input('search');

        $staffQuery = User::with(['role', 'zone'])
            ->where('bank_id', $user->bank_id)
            ->whereHas('role', function ($q) {
                $q->where('role_name', '!=', 'user');
            });

        if ($search) {
            $staffQuery->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('role', function ($r) use ($search) {
                        $r->where('role_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('zone', function ($z) use ($search) {
                        $z->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // PAGINATE
        $paginator = $staffQuery
            ->paginate(5)
            ->withQueryString();

        // TRANSFORM ONLY THE COLLECTION
        $paginator->setCollection(
            $paginator->getCollection()->transform(function ($staff) {
                return [
                    'id' => $staff->user_id,
                    'name' => $staff->full_name,
                    'email' => $staff->email,
                    'role' => $staff->role ? [
                        'id' => $staff->role->role_id,
                        'name' => $staff->role->role_name,
                    ] : null,
                    'zone' => $staff->zone ? [
                        'id' => $staff->zone->zone_id,
                        'name' => $staff->zone->name,
                    ] : null,
                    'profile_photo' => $staff->profile_photo,
                    'number'=>$staff->phone_number,
                ];
            })
        );

        return Inertia::render('Admin2/AllStaffs', [
            'staff' => $paginator,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
