<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Branch;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
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
                    'number' => $staff->phone_number,
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

    public function index()
    {
        $user = Auth::user();

        // Get requests of this user
        $requests = User::where('user_id', $user->user_id)
            ->with('branch.bank') // load branch and its bank
            ->latest()
            ->get();

        // Load all banks (for dropdown)
        $banks = Bank::with('branches')->get();

        // dd($banks);
        return inertia('User/RequestBank', [
            'requests' => $requests,
            'banks' => $banks,
        ]);
    }
    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            // Check if user already belongs to a bank or has a pending request
            if ($user->bank_id) {
                return redirect()->back()->with('error', 'You already belong to a bank. Cannot request another.');
            }

            if ($user->status === 'pending' && $user->bank_id) {
                return redirect()->back()->with('error', 'You already have a pending bank request.');
            }

            // Validate input
            $data = $request->validate([
                'bank_id' => 'required|exists:banks,bank_id',
                'branch_id' => 'required|exists:branches,branch_id',
            ]);

            $data['user_id'] = $user->user_id;
            $data['status'] = 'pending';

            // Update existing pending request or create new one
            User::updateOrCreate(
                [
                    'user_id' => $user->user_id,
                    'status' => 'pending',
                ],
                [
                    'bank_id' => $data['bank_id'],
                    'branch_id' => $data['branch_id'],
                    'status' => 'pending',
                ]
            );

            return redirect()->back()->with('success', 'Request sent successfully!');
        } catch (\Throwable $e) {

            Log::error('User creation failed', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'request_data'  => $request->except(['password', 'password_confirmation']),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }

    public function cancelRequest(User $user)
    {
        try {
            $authUser = Auth::user();


            if ($authUser->user_id !== $user->user_id || $user->status !== 'pending') {
                return redirect()->back()->with('error', 'Cannot cancel this request.');
            }


            if ($user->created_at < now()->subHours(48)) {
                return redirect()->back()->with('error', 'Request can only be canceled within 48 hours.');
            }

            $user->update([
                'bank_id' => null,
                'branch_id' => null,
                'status' => 'pending',
            ]);

            return redirect()->back()->with('success', 'Request canceled successfully.');
        } catch (\Throwable $e) {

            Log::error('User creation failed', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'request_data'  => $user->except(['password', 'password_confirmation']),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }
}
