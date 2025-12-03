<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use function Laravel\Prompts\select;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function branchAdmin($id)
    {
        $branch = Branch::findOrFail($id);
        return inertia('Admin1/CreateBranchAdmin', [
            'branch' => $branch,
        ]);
    }
   public function availableBranches($id)
{
    $branches = Branch::where('bank_id', $id)
        ->select('branch_id', 'name', 'address')
        ->get();
    return Inertia::render('Branches', [
        'branches' => $branches
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
        //creating branches of banks

        $bankId = Auth::user()->bank_id;
        $request->validate(
            [
                'name' => 'required',
                'address' => 'required',
                'contact_number' => 'required',
                'email' => 'required',
            ]
        );

        Branch::create(
            [
                'bank_id' => $bankId,
                'name' => $request->name,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
                'email' => $request->email,

            ]
        );


        return redirect()->route('bnkadmindashboard')->with('success', 'Branch created successfully');
    }

    public function availableusers(Request $request)
    {

        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $usersBranchId = Auth::user()->branch_id;
        $users = DB::table('users')
            ->join('roles', 'roles.role_id', '=', 'users.role_id')
            ->where('users.branch_id', $usersBranchId)
            ->where('roles.role_name', 'user')
            ->select('users.*')
            ->get();


        //dd($users);

        return response()->json([
            'users' => $users,

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
