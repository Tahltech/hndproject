<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\{
    AgentController,
    BallanceController,
    BankController,
    UserController,
    BranchController,
    DashboardController,
    LoanController,
    ZoneController,
    SettingsController,
};
use App\Http\Controllers\BankProfileController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/', [BankController::class, "availableBanks"])->name('home');
Route::get('/branches/{id}', [BranchController::class, "availableBranches"])->name("branches");

// login / signup
Route::get('/login', fn() => Inertia::render('Login'))->name('login');
Route::get('/signup', fn() => Inertia::render('Signup'))->name('signup');

Route::post('/signup', [UserController::class, 'storeUsers'])->name('signup');
Route::post('/login', [UserController::class, 'login'])->name('submitlogin');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');


Route::middleware('auth')->group(function () {
    Route::get('/settings', [SettingsController::class, 'index'])->name("settings");
    Route::post('/settings/updateprofile', [SettingsController::class, 'updateProfile'])->name("updateprofile");
    Route::post('/settings/password', [SettingsController::class, 'updatePassword'])->name("updatepassword");
    Route::post('/settings/preferences', [SettingsController::class, 'updatePreferences'])->name("updatepreferences");
});

/*
|--------------------------------------------------------------------------
| IT ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'check_permission:view_dashboard_it_admin'])
    ->prefix('Itadmindashboard')
    ->name('itadmin.')
    ->group(function () {

        Route::get('/', fn() => Inertia::render('Admin/Admindashboard'))
            ->name('admindashboard');

        Route::get('/create', fn() => Inertia::render('Admin/CreateBank'))
            ->name('createbank');

        Route::post('/create', [BankController::class, 'store'])->name("newbank");

        Route::get('/admin/banks', [BankController::class, 'index'])
            ->name('admin.banks');

        Route::get('/bankadmin{id}', [BankController::class, 'createAdmin'])
            ->name('create.admin');

        Route::post('/bankadmin', [UserController::class, 'bankAdmin'])
            ->name('bank.admin');
        Route::get("alladmins", [BankController::class, 'Alladmins'])->name('allbankadmins');
        Route::patch('/bankadmins/{user}/status', [BankController::class, 'toggleStatus'])
            ->name('bankadmin.status');

        Route::delete('/bankadmins/{user}', [BankController::class, 'destroy'])
            ->name('bankadmin.delete');
    });

/*
|--------------------------------------------------------------------------
| BANK ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('bnkadmindashboard')->group(function () {

    Route::get('/', [BranchController::class, 'dashboard'])
        ->name('bnkadmindashboard');

    Route::get('/branches', [BranchController::class, 'index'])
        ->name('bnkadmindashboard');


    Route::get('/allbranchadmins', [BranchController::class, 'alladmins'])
        ->name('allbranchadmin');

    Route::get('/create', fn() => Inertia::render('Admin1/CreateBranch'))
        ->name('createbranch');

    Route::post('/create', [BranchController::class, 'store'])
        ->name('storebranch');

    Route::get('/branch/{branch}/admin', [BranchController::class, 'branchAdmin'])
        ->name('createbranchadmin');

    Route::patch('/branch/{branch}/update', [BranchController::class, 'update'])
        ->name('updatebranch');

    Route::delete('/branch/{branch}/delete', [BranchController::class, 'destroy'])
        ->name('deletebranch');
    Route::patch('/branch/{user}/status', [BankController::class, 'toggleStatus'])
        ->name('togglestatusbranchadmin');
         Route::get('/profile', [BankProfileController::class, 'show'])->name('bank.profile');

    Route::patch('/profile/general', [BankProfileController::class, 'updateGeneral']);
    Route::patch('/profile/branding', [BankProfileController::class, 'updateBranding']);
    Route::patch('/profile/contact', [BankProfileController::class, 'updateContact']);
    Route::patch('/profile/settings', [BankProfileController::class, 'updateSettings']);

});


/*
|--------------------------------------------------------------------------
| BRANCH ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('branchadmindashboard')->group(function () {

    Route::get('/', fn() => Inertia::render('Admin2/Admindashboard'))
        ->name('branchadmindashboard');

    Route::get('/create/{id}', [BranchController::class, 'branchAdmin'])
        ->name('createbranchadmin');

    Route::get('/available/branch', [BranchController::class, 'index']);

    Route::post('/create', [UserController::class, 'branchAdmin'])
        ->name('storeBranchAdmin');

    Route::get("/role", fn() => inertia("Admin2/CreateRole"));

    Route::post("/createzone", [UserController::class, 'zonesave'])
        ->name("savezone");
});

// extra branch admin pages
Route::get('branchadmin/create', fn() => Inertia::render('Admin2/CreateStaff'))
    ->name("createstaff");

Route::get("branchadmin/createzone", fn() => Inertia::render('Admin2/CreateZone'))
    ->name('createzone');


/*
|--------------------------------------------------------------------------
| ZONE / AGENT MANAGEMENT
|--------------------------------------------------------------------------
*/
Route::get('available/agents', [ZoneController::class, 'agents']);
Route::get('available/zones', [ZoneController::class, 'Zones']);
Route::post('assign/zones', [ZoneController::class, 'assignZones'])->name("assignAgents");


/*
|--------------------------------------------------------------------------
| LOAN OFFICER ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/loanadmindashboard', [LoanController::class, 'getLoans'])
    ->name('loanadmindashboard');


/*
|--------------------------------------------------------------------------
| BRANCH USERS MANAGEMENT
|--------------------------------------------------------------------------
*/
Route::get('/available/branchusers', [BranchController::class, 'availableusers']);
Route::get('allbranch/users', fn() => Inertia::render('Admin2/AvailableUsers'))
    ->name('availableusers');


/*
|--------------------------------------------------------------------------
| AGENT ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/agent/clients', [AgentController::class, 'agentclients']);
Route::post('/assign/userzone', [AgentController::class, 'alterusers'])
    ->name("alterZone");

Route::post("/remove/userszone", [AgentController::class, 'removeuserzone'])
    ->name("removeZone");


/*
|--------------------------------------------------------------------------
| ACCOUNTANT ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('accountadmindashboard')->group(function () {
    Route::get('/', fn() => Inertia::render('Admin1/Admindashboard'))
        ->name('accountadmindashboard');
});


/*
|--------------------------------------------------------------------------
| SUPPORT OFFICER ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('supportadmindashboard')->group(function () {
    Route::get('/', fn() => Inertia::render('Admin1/Admindashboard'))
        ->name('supportadmindashboard');
});


/*
|--------------------------------------------------------------------------
| AGENT DASHBOARD
|--------------------------------------------------------------------------
*/
Route::get('agentadmindashboard', fn() => Inertia::render('Agent/Agentdashboard'))
    ->name('agentadmindashboard');


/*
|--------------------------------------------------------------------------
| USER DASHBOARD + ACCOUNT MANAGEMENT
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'check_permission:view_dashboard_user'])
    ->prefix('dashboard')
    ->group(function () {

        Route::get('/', fn() => Inertia::render('User/Userdashboard'))
            ->name('userdashboard');

        Route::get('account/ballance', [BallanceController::class, 'getBalance'])
            ->middleware('ajax.only');

        Route::post('/addballance', [BallanceController::class, 'addballance'])
            ->name("newballance");
    });


/*
|--------------------------------------------------------------------------
| STAFF CREATION UNDER BRANCH
|--------------------------------------------------------------------------
*/
Route::post('/branchadmin/createstaff', [UserController::class, 'storeStaff'])
    ->name("branch_staff");


/*
|--------------------------------------------------------------------------
| LOAN ROUTES (USER + ADMIN)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('dashboard')->group(function () {

    Route::resource('loan', LoanController::class);

    Route::post("/user/apply", [LoanController::class, 'applyloan'])
        ->name("loan.apply");

    Route::post("loan/status/{id}", [LoanController::class, "changeStatus"])
        ->name("changeStatus");
});
