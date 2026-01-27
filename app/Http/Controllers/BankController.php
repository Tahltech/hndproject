<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use App\Services\SmsService;
use App\Models\Branch;
use App\Services\PHPMailerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $search = $request->query('search', null);

        $banks = Bank::query()
            ->when($search, fn($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(5);

        return response()->json([
            'banks' => [
                'data' => $banks->items(),          // actual bank records
                'meta' => [
                    'total' => $banks->total(),
                    'per_page' => $banks->perPage(),
                    'current_page' => $banks->currentPage(),
                    'last_page' => $banks->lastPage(),
                ],
                'authUser' => Auth::user(),
            ],

        ]);
    }


    public function availableBanks()
    {
        //using the banks model to get the available banks under this project 
        $banks =  Bank::all();

        return Inertia::render("Home", [
            "banks" => $banks,
        ]);
    }

    public function createAdmin(Request $request, $id)
    {

        $bank = Bank::findOrFail($id);
        return inertia('Admin/CreateBankAdmin', [
            'bank' => $bank,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, SmsService $sms, PHPMailerService $mailer)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'address' => 'required|max:100',
            'contact_number' => 'required|max:20',
            'email' => 'required|email',
        ]);

        try {
            $bank = Bank::create([
                'name' => $request->name,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
            ]);


            $emailBody = view('emails.bank_creation', [
                'bank' => $bank,
            ])->render();

            $mailer->sendEmail(
                $bank->email,
                'Your  Bank Creation with TahlFin',
                $emailBody
            );
        } catch (\Throwable $e) {
            Log::error('Bank creation failed', [
                'error_message' => $e->getMessage(),
            ]);


            return back()->withInput()->with('error', 'Error Trying  create bank' . $request->name);
        }



        // try {
        //     $sms->send(
        //         $request->contact_number,
        //         "Hello {$request->name}, your bank has been created successfully with TahlFin. Thank you for trusting us."
        //     );
        // } catch (\Throwable $e) {
        //     Log::warning('SMS failed', [
        //         'phone' => $request->contact_number,
        //         'error' => $e->getMessage(),
        //     ]);
        // }

        return back()->with('success', 'Bank created successfully');
    }

    /**
     * Get all bank admins (for the bank of the auth user).
     */
    public function allAdmins()
    {
        try {
            $admins = User::with(['role', 'bank'])
                ->whereHas('role', function ($query) {
                    $query->where('role_name', 'overall_admin');
                })->latest()
                ->get();

            return Inertia::render('Admin/BankAdmins', [
                'bankAdmins' => $admins,
            ]);
        } catch (\Throwable $e) {
            Log::error('User creation failed', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }

    /**
     * Toggle the status of a bank admin (active/inactive)
     */

    public function toggleStatus(User $user, PHPMailerService $mailer)
    {
        try {
            $user->load(['role', 'bank', 'branch']);
            $newStatus = null;

            DB::transaction(function () use ($user, &$newStatus) {

                $newStatus = $user->status === 'active' ? 'pending' : 'active';
                $user->update(['status' => $newStatus]);

                if ($user->role?->role_name === 'overall_admin' && $user->bank) {
                    $user->bank->update(['status' => $newStatus]);
                    $user->bank->users()->update(['status' => $newStatus]);
                }

                if ($user->role?->role_name === 'branch_manager' && $user->branch) {
                    $user->branch->update(['status' => $newStatus]);
                    $user->branch->users()->update(['status' => $newStatus]);
                }
            });

            $emailView = $newStatus === 'active'
                ? 'emails.account-activated'
                : 'emails.account-deactivated';

            $emailBody = view($emailView, [
                'user' => $user,
            ])->render();

            $mailer->sendEmail(
                $user->email,
                'Account ' . ($newStatus === 'active' ? 'Activation' : 'Deactivation'),
                $emailBody
            );

            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully',
                'user' => $user->fresh(['branch']),
            ]);
        } catch (\Throwable $e) {
            Log::error('Status toggle failed', [
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
            ], 500);
        }
    }


    /**
     * Delete a bank admin.
     */
    public function destroy(User $user)
    {

        $user->delete();

        return redirect()->back()->with('success', 'Bank Admin deleted successfully!');
    }

    public function deletebank(Bank $bank)
    {
        try {
            DB::transaction(function () use ($bank) {


                $bank->users()->update([
                    'status' => 'pending',
                ]);


                $bank->delete();
            });

            return redirect()->route("itadmin.admindashboard")->with('success', 'Bank deleted successfully. All related users are now pending.');
        } catch (\Throwable $e) {
            Log::error('Bank deletion failed', [
                'bank_id' => $bank->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to delete bank. Please try again.');
        }
    }
}
