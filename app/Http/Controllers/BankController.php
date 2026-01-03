<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Branch;
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
        // get all banks
        $banks = Bank::all();
        return response()->json([
            'banks' => $banks
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
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'address' => 'required|max:100',
            'contact_number' => 'required|max:15',
            'email' => 'required|email',

        ]);

        try {
            Bank::create([
                'name' => $request->name,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
                'email' => $request->email,

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


        return redirect()->back()->with("success", "Bank created succcessfully");
    }
    /**
     * Store a new bank admin user.
     */
    public function bankAdmin(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|confirmed|min:8',
            'bank_id' => 'required|exists:banks,bank_id',
        ]);
        try {
            $user = User::create([
                'full_name' => $request->full_name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'bank_id' => $request->bank_id,
                'role_id' => 2,
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



        return redirect()->back()
            ->with('success', 'Bank Admin created successfully!');
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

    public function toggleStatus(User $user)
    {

        try {
            DB::transaction(function () use ($user, &$updatedUser) {


                $newStatus = $user->status === 'active' ? 'pending' : 'active';
                $user->update(['status' => $newStatus]);


                $updatedUser = $user->fresh();

                // Handle overall_admin role
                if ($user->role && $user->role->role_name === 'overall_admin' && $user->bank) {
                    $user->bank->update(['status' => $newStatus]);
                    $user->bank->users()->update(['status' => $newStatus]);
                }

                // Handle branch_manager role
                if ($user->role && $user->role->role_name === 'branch_manager' && $user->branch) {
                    $user->branch->update(['status' => $newStatus]);
                    $user->branch->users()->update(['status' => $newStatus]);
                }
            });
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

        
       return response()->json([
        'success' => true,
        "message"=> "user Status updated sucessfully",
        'user' => $user->fresh(), 
    ]);
    }

    /**
     * Delete a bank admin.
     */
    public function destroy(User $user)
    {

        $user->delete();

        return redirect()->back()->with('success', 'Bank Admin deleted successfully!');
    }
}
