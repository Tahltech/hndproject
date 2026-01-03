<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Foundation\Auth\User as AuthUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use function Laravel\Prompts\select;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function viewUserInfo($id)
    {
        $user = User::with([
            'bank:bank_id,name',
            'branch:branch_id,name',
            'kyc'
        ])->where('user_id', $id)->firstOrFail();

        return inertia('Admin2/UserKycView', [
            'user' => $user,
        ]);
    }

    public function availableBranches($id)
    {
        $branches = Branch::where('bank_id', $id)
            ->select('branch_id', 'name', 'address')
            ->get();
        return Inertia::render('Branches', [
            'branches' => $branches,
            'bank_id' => $id
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $bankId = Auth::user()->bank_id;


        $branches = DB::table('branches')
            ->join('banks', 'branches.bank_id', '=', 'banks.bank_id')
            ->where('branches.bank_id', $bankId)
            ->select('branches.*', 'banks.name as bank_name')
            ->get();

        return response()->json([
            'branches' => $branches
        ]);
    }

    public function alladmins()
    {
        $user = Auth::user();


        $admins = User::with(['role', 'branch'])
            ->whereHas('role', function ($query) {
                $query->where('role_name', 'branch_manager');
            })->latest()
            ->get();


        return Inertia::render("Admin1/BranchAdmins", [
            'branches' => $admins,
        ]);
    }



    public function availableusers(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $branchId = Auth::user()->branch_id;
        $search = $request->query('search');

        $users = DB::table('users')
            ->join('roles', 'roles.role_id', '=', 'users.role_id')
            ->where('users.branch_id', $branchId)
            ->where('roles.role_name', 'user')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('users.full_name', 'like', "%{$search}%")
                        ->orWhere('users.username', 'like', "%{$search}%")
                        ->orWhere('users.email', 'like', "%{$search}%");
                });
            })
            ->orderBy('users.created_at', 'desc')
            ->select('users.*')
            ->paginate(10);

        return response()->json($users);
    }


    /**
     * Dashboard: Show all branches for the authenticated bank admin
     */
    public function dashboard()
    {
        $user = Auth::user();
        $bank = $user->bank;

        // Fetch branches belonging to the bank
        $branches = Branch::where('bank_id', $bank->id)->get();

        return Inertia::render('Admin1/Admindashboard', [
            'branches' => $branches,
            'authUser' => $user,
        ]);
    }

    /**
     * Store a new branch
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $bank = $user->bank;

        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:branches,name,NULL,id,bank_id,' . $bank->id,
            'address' => 'nullable|string|max:255',
            "contact_number" => 'required',
            'string',
            'min:7',
            'max:20',
            'regex:/^[0-9+\s()-]+$/',
            'email' => 'required|string|max:100'
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        // Create branch
        Branch::create([
            'bank_id' => $bank->bank_id,
            'name' => $request->name,
            'address' => $request->address,
            'contact_number' => $request->contact_number,
            'email' => $request->email,
        ]);

        return Redirect::route('bnkadmindashboard')->with('success', 'Branch created successfully.');
    }

    /**
     * Show the branch admin page for a specific branch
     */
    public function branchAdmin(Branch $branch)
    {
        $user = Auth::user();

        if ($branch->bank_id !== $user->bank_id) {
            abort(403, 'Unauthorized access to this branch.');
        }

        return Inertia::render('Admin1/CreateBranchAdmin', [
            'branch' => $branch,
            'authUser' => $user,
        ]);
    }

    /**
     * Update branch (optional)
     */
    public function update(Request $request, Branch $branch)
    {
        $user = Auth::user();

        if ($branch->bank_id !== $user->bank_id) {
            abort(403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:branches,name,' . $branch->id . ',id,bank_id,' . $user->bank_id,
            'location' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $branch->update($request->only(['name', 'location', 'status']));

        return Redirect::route('bnkadmindashboard')->with('success', 'Branch updated successfully.');
    }

    /**
     * Delete branch (optional)
     */
    public function destroy(Branch $branch)
    {
        $user = Auth::user();

        if ($branch->bank_id !== $user->bank_id) {
            abort(403);
        }

        $branch->delete();

        return Redirect::route('bnkadmindashboard')->with('success', 'Branch deleted successfully.');
    }



    public function destroyAdmin(User $user)
    {
        $authUser = Auth::user();

        // Check if the user belongs to the same bank as the authenticated user
        if ($user->bank_id !== $authUser->bank_id) {
            abort(403, 'You do not have permission to deactivate this user.');
        }

        // Instead of deleting, set status to 'inactive'
        $user->update([
            'status' => 'inactive',
        ]);

        return redirect()->route('bnkadmindashboard')->with('success', 'User has been deactivated successfully.');
    }
}
