<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Inertia\Inertia;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\User;
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
        // find that specific bank
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $bank = Bank::findOrFail($id);
        return inertia('Admin/CreateBankAdmin', [
            'bank' => $bank,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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

        Bank::create([
            'name' => $request->name,
            'address' => $request->address,
            'contact_number' => $request->contact_number,
            'email' => $request->email,

        ]);


        return redirect()->route("admindashboard")->with("success", "Bank created succcessfully");
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
            'bank_id' => 'required|exists:banks,id',
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'bank_id' => $request->bank_id,
            'role_id' => 2, // assuming 2 = Bank Admin role
        ]);

        return redirect()->route('allbankadmins')
            ->with('success', 'Bank Admin created successfully!');
    }

    /**
     * Get all bank admins (for the bank of the auth user).
     */
    public function allAdmins()
    {
        $authBankId = Auth::user()->bank_id;

        $admins = User::where('bank_id', $authBankId)
            ->where('role_id', 2) // bank admin role
            ->get();

        return view('Bank.allAdmins', compact('admins'));
    }

    /**
     * Toggle the status of a bank admin (active/inactive)
     */

    public function toggleStatus(User $user)
    {
        DB::transaction(function () use ($user) {

            // Toggle user status
            $newStatus = $user->status === 'active' ? 'pending' : 'active';

            $user->update([
                'status' => $newStatus,
            ]);

            // Check if user is overall admin
            if (
                $user->role &&
                $user->role->role_name === 'overall_admin' &&
                $user->bank
            ) {

                $user->bank->update([
                    'status' => $newStatus,
                ]);

                // Update ALL users under this bank
                $user->bank->users()->update([
                    'status' => $newStatus,
                ]);
            }
             if (
            $user->role &&
            $user->role->role_name === 'branch_manager' &&
            $user->branch
        ) {
           
            $user->bank->update([
                'status' => $newStatus,
            ]);

            // Update ALL users under this bank
            $user->bank->users()->update([
                'status' => $newStatus,
            ]);
        }
        });

        return back()->with('success', 'User and bank status updated successfully');
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
