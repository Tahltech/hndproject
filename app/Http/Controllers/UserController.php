<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Branch;
use Illuminate\Http\Request;
use App\Models\Methode\Middleware;
use App\Models\Zone;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use function Laravel\Prompts\password;

use Illuminate\Routing\Controller as BaseController;

class UserController extends Controller
{
    // Only authenticated admins can access certain methods
    // public function __construct()
    // {
    //     $this->middleware('auth')->except(['createFrontend', 'storeFrontend']);
    // }

    // Show frontend registration form
    public function createFrontend()
    {
        $branches = Branch::all();
        return view('users.register', compact('branches'));
    }

    public function login(Request $request)
    {
        // Validate credentials
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        // dd($credentials
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            /** @var \App\Models\User&\Spatie\Permission\Traits\HasRoles $user */
            $user = Auth::user();

            if ($user->status !== 'active') {
                return redirect()->route('login')->withErrors([
                    'email' => 'Your account is not active yet. Contact admin.'
                ]);
            }

            // Get the first role assigned to the user
            $roleName = $user->getRoleNames()->first();

            // Redirect based on role and permission
            switch ($roleName) {
                case 'user':
                    return redirect()->route('userdashboard');
                case 'it_admin':
                    return redirect()->route('admindashboard');
                case 'overall_admin':
                    return redirect()->route('bnkadmindashboard');
                case 'branch_manager':
                    return redirect()->route('branchadmindashboard');
                case 'loan_officer':
                    return redirect()->route('loanadmindashboard');
                case 'accountant':
                    return redirect()->route('accountadmindashboard');
                case 'support_officer':
                    return redirect()->route('supportadmindashboard');
                case 'agent':
                    return redirect()->route('agentadmindashboard');
                default:
                    abort(403, 'No valid dashboard assigned for your role.');
            }
        }

        // Failed authentication
        return back()->withErrors([
            'email' => 'Invalid credentials, please try again.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }



    // Handle frontend user registration
    public function storeUsers(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:100',
            'username' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|unique:users,phone_number',
            'branch_id' => 'exists:branches,branch_id',
            'password' => 'required|min:5|confirmed',

        ]);

        $roleName = 'user';
        // Legacy role_id for DB relations
        $legacyRole = Role::where('name', $roleName)->first();
        //Create the user in your main users table
        $user = User::create([
            'full_name' => $request->full_name,
            'username' => strtolower(str_replace(' ', '_', $request->full_name)),
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'branch_id' => $request->branch_id,
            'role_id' =>  $legacyRole->id,
            'password' => Hash::make($request->password),
            'status' => 'pending',
        ]);

        $user->assignRole($roleName);

        return redirect()->route("login")->with('success', 'Your account has been created! Wait for approval.');
    }


    //creating a banks overall admin
    public function bankAdmin(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:100',
            'username' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|unique:users,phone_number',
            'branch_id' => 'exists:branches,branch_id',
            'bank_id' => 'exists:banks,bank_id|required',
            'password' => 'required|min:5|confirmed',

        ]);
        $roleName = 'overall_admin';
        // Legacy role_id for DB relations
        $legacyRole = Role::where('name', $roleName)->first();
        //Create the user in your main users table
        $user = User::create([
            'full_name' => $request->full_name,
            'username' => strtolower(str_replace(' ', '_', $request->full_name)),
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'branch_id' => $request->branch_id,
            'role_id' =>  $legacyRole->id,
            'bank_id' =>  $request->bank_id,
            'password' => Hash::make($request->password),
            'status' => 'active',
        ]);

        $user->assignRole($roleName);

        return redirect()->route("admindashboard")->with('success', 'Your account has been created! Wait for approval.');
    }

     public function branchAdmin(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:100',
            'username' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|unique:users,phone_number',
            'branch_id' => 'exists:branches,branch_id',
            'password' => 'required|min:5|confirmed',

        ]);

        $roleName = 'branch_manager';
        $bankId =Auth::user()->bank_id;
        // Legacy role_id for DB relations
        $legacyRole = Role::where('name', $roleName)->first();
        //Create the user in your main users table
        $user = User::create([
            'full_name' => $request->full_name,
            'username' => strtolower(str_replace(' ', '_', $request->full_name)),
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'branch_id' => $request->branch_id,
            'role_id' =>  $legacyRole->id,
            'bank_id' =>  $bankId,
            'password' => Hash::make($request->password),
            'status' => 'active',
        ]);

        $user->assignRole($roleName);

        return redirect()->route("bnkadmindashboard")->with('success', 'Your account has been created!');
    }



    // Show branch admin dashboard to create staff
    public function createStaff()
    {
        $branches = Branch::where('branch_id', Auth::user()->branch_id)->get();
        $roles = Role::whereNotIn('role_name', ['user', 'overall_admin'])->get();
        return view('users.create_staff', compact('branches', 'roles'));
    }

    // Store branch staff
    public function storeStaff(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'username'=>'string|max:100',
            'phone_number' => 'required|unique:users,phone_number',
            'role' => 'required|exists:roles,role_name',
            'password' => 'required',
        ]);

        $staff = Auth::user();
        $roleId = Role::where("name",$request->role)->first();

        //dd($roleId);

      $staffs =  User::create([
            'full_name' => $request->full_name,
            'username' => $request->username,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'branch_id' => $staff->branch_id,
            'bank_id'=>$staff->bank_id,
            'role_id' => $roleId->id,
            'password' => Hash::make($request->password),
            'status' => 'active',
        ]);
        //dd($oops);
          $staffs->assignRole($request->role);
        

        return redirect()->route("branchadmindashboard")->with('success', 'Staff account created successfully!');
    }

    // Approve pending user (Support Officer or Branch Admin)
    public function approveUser($id)
    {
        $user = User::findOrFail($id);
        $user->status = 'active';
        $user->save();

        return redirect()->back()->with('success', 'User approved successfully!');
    }

    // Reject pending user
    public function rejectUser($id)
    {
        $user = User::findOrFail($id);
        $user->status = 'rejected';
        $user->save();

        return redirect()->back()->with('success', 'User registration rejected.');
    }

    /**
     * create
     */

    // List all users for branch dashboard
    public function index()
    {
        $users = User::where('branch_id', Auth::user()->branch_id)->get();
        return view('users.index', compact('users'));
    }
    
    public function zonesave(Request $request){
        $request->validate([
            "zoneName"=>'required|min:5',
        ]);

        $branchId = Auth::user()->branch_id;

        Zone::create([
            'branch_id'=>$branchId,
            'name'=>$request->zoneName,
        ]);

        return redirect()->route("branchadmindashboard")->with("success", "zone created succesfully");

    }
}
