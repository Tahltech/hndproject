<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Zone;
use Inertia\Inertia;
use App\Models\Branch;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Methode\Middleware;
use App\Services\PHPMailerService;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Hash;
use function Laravel\Prompts\password;
use Illuminate\Routing\Controller as BaseController;
use PhpParser\Node\Stmt\TryCatch;

class UserController extends Controller
{

    public function createFrontend()
    {
        $branches = Branch::all();
        return view('users.register', compact('branches'));
    }

    public function showSignup(Request $request, $bank = null, $branch = null)
    {
        return Inertia::render('Signup', [
            'bank_id'   => $bank,
            'branch_id' => $branch,
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            /** @var \App\Models\User&\Spatie\Permission\Traits\HasRoles $user */
            $user = Auth::user();
            $roleName = $user->getRoleNames()->first();
            // Redirect based on role and permission
            switch ($roleName) {
                case 'user':
                    return redirect()->route('userdashboard');
                case 'it_admin':
                    return redirect()->route('itadmin.admindashboard');
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
        return redirect()
            ->route('home')
            ->withHeaders([
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma'        => 'no-cache',
                'Expires'       => '0',
            ]);
    }
    // Handle frontend user registration
    public function storeUsers(Request $request, PHPMailerService $mailer)
    {
        $request->validate([
            'full_name' => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|unique:users,phone_number',
            'password' => 'required|min:5|confirmed',
            'bank_id'     => 'nullable|exists:banks,bank_id',
            'branch_id'   => 'nullable|exists:branches,branch_id',

        ]);

        $roleName = 'user';
        $legacyRole = Role::where('name', $roleName)->first();



        try {
            $user = User::create([
                'full_name'     => $request->full_name,
                'username'      => $request->username,
                'email'         => $request->email,
                'phone_number'  => $request->phone_number,
                'branch_id'     => $request->branch_id,
                'bank_id'     => $request->bank_id,
                'role_id'       => $legacyRole->id,
                'password'      => Hash::make($request->password),
                'status'        => 'pending',
            ]);

            if ($user->bank_id) {
                $emailBody = view('emails.account-created', [
                    'user' => $user,
                ])->render();

                $mailer->sendEmail(
                    $user->email,
                    'Account Created with TahlFIN under  ' . $user->bank->name,
                    $emailBody
                );
            } else {
                $emailBody = view('emails.User_created', [
                    'user' => $user,
                ])->render();

                $mailer->sendEmail(
                    $user->email,
                    'Account Created with TahlFIN',
                    $emailBody
                );
            }
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



        $user->assignRole($roleName);

        return redirect()->route("login")->with('success', 'Your account has been created! Wait for approval.');
    }


    public function bankAdmin(Request $request, PHPMailerService $mailer)
    {
        $request->validate([
            'full_name' => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|unique:users,phone_number',
            'branch_id' => 'exists:branches,branch_id',
            'bank_id' => 'exists:banks,bank_id|required',

        ]);

        $roleName = 'overall_admin';
        $legacyRole = Role::where('name', $roleName)->first();

        $tempPassword = Str::random(8);

        try {
            $user = User::create([
                'full_name' => $request->full_name,
                'username' => $request->username ?? strtolower(str_replace(' ', '_', $request->full_name)),
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'branch_id' => $request->branch_id,
                'role_id' =>  $legacyRole->id,
                'bank_id' =>  $request->bank_id,
                'password' => Hash::make($tempPassword),
                'status' => 'active',
            ]);
            $emailBody = view('emails.bankadminaccount', [
                'user' => $user,
                'password' => $tempPassword,
            ])->render();

            $mailer->sendEmail(
                $user->email,
                'Your Bank Admin Creation with TahlFin',
                $emailBody
            );
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


        $user->assignRole($roleName);

        return redirect()->back()->with('success', 'Account has been created successfully.');
    }

    public function branchAdmin(Request $request, PHPMailerService $mailer)
    {
        $request->validate([
            'full_name' => 'required|string|max:100',
            'username' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|unique:users,phone_number',
            'branch_id' => 'exists:branches,branch_id',


        ]);

        $roleName = 'branch_manager';
        $bankId = Auth::user()->bank_id;


        $tempPassword = Str::random(8);
        $legacyRole = Role::where('name', $roleName)->first();
        try {
            $user = User::create([
                'full_name' => $request->full_name,
                'username' => $request->username ?? strtolower(str_replace(' ', '_', $request->full_name)),
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'branch_id' => $request->branch_id,
                'role_id' =>  $legacyRole->id,
                'bank_id' =>  $bankId,
                'password' => Hash::make($tempPassword),
                'status' => 'active',
            ]);
            $emailBody = view('emails.branchadmin', [
                'user' => $user,
                'password' => $tempPassword,
            ])->render();

            $mailer->sendEmail(
                $user->email,
                'Your Branch Admin Creation with TahlFIN',
                $emailBody
            );

            $user->assignRole($roleName);

            return redirect()->route("bnkadmindashboard")->with('success', 'Your account has been created!');
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

    // Store branch staff
    public function storeStaff(Request $request, PHPMailerService $mailer)
    {
        $request->validate([
            'full_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'username' => 'string|max:100',
            'phone_number' => 'required|unique:users,phone_number',
            'role' => 'required|exists:roles,role_name',

        ]);

        $staff = Auth::user();
        $roleId = Role::where("name", $request->role)->first();

        $tempPassword = Str::random(8);

        try {
            $user =  User::create([
                'full_name' => $request->full_name,
                'username' => $request->username,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'branch_id' => $staff->branch_id,
                'bank_id' => $staff->bank_id,
                'role_id' => $roleId->id,
                'password' => Hash::make($tempPassword),
                'status' => 'active',
            ]);
            $user->assignRole($request->role);

            $emailBody = view('emails.account-created', [
                'user' => $user,
            ])->render();

            $mailer->sendEmail(
                $user->email,
                'Account Created with TahlFIN under  ' . $user->bank->name,
                $emailBody
            );

            return redirect()->route("branchadmindashboard")->with('success', 'Staff account created successfully!');
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

    public function pending()
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route("home");
        }
        $users = User::where('branch_id', $user->branch_id)
            ->where('status', 'pending')
            ->get();

        return Inertia::render("Admin2/RequestedUsers", [
            'users' => $users,
        ]);
    }

    public function approve($id, PHPMailerService $mailer)
    {
        $user = User::findOrFail($id);
        try {
            $user->status = 'active';
            $user->save();

            $emailBody = view('emails.account-activated', [
                'user' => $user,
            ])->render();

            $mailer->sendEmail(
                $user->email,
                'Account Approved Under  ' . $user->bank->name,
                $emailBody
            );

            return redirect()->back()->with('success', 'User approved successfully!');
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

    // Reject pending user
    public function reject($id, PHPMailerService $mailer)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return redirect()->route("home");
        }
        try {
            $user->status = 'rejected';
            $user->save();

            $emailBody = view('emails.account-activated', [
                'user' => $user,
            ])->render();

            $mailer->sendEmail(
                $user->email,
                'Account Rejected' . $user->bank->name,
                $emailBody
            );

            return redirect()->back()->with('success', 'User registration rejected.');
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


    public function index()
    {
        $users = User::where('branch_id', Auth::user()->branch_id)->get();
        return view('users.index', compact('users'));
    }

    public function zonesave(Request $request, PHPMailerService $mailer)
    {
        $request->validate([
            "zoneName" => 'required|min:5',
        ]);

        $branchId = Auth::user()->branch_id;



        try {
            Zone::create([
                'branch_id' => $branchId,
                'name' => $request->zoneName,
            ]);
        } catch (\Throwable $e) {
            Log::error('User creation failed', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
            ]);
            return redirect()->route("branchadmindashboard")->with("success", "zone created succesfully");

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again later.');
        }
    }
}
