<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\{
    AccountantCOntroller,
    AgentController,
    BallanceController,
    BankController,
    UserController,
    BranchController,
    DashboardController,
    LoanController,
    ZoneController,
    SettingsController,
    BankBranchController,
    LoanRepayController,
    TransactionController,
    UserKycController
};
use App\Http\Controllers\BankAdmin\BankProfileController;
use Phiki\Grammar\Injections\Prefix;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/', [BankController::class, "availableBanks"])->name('home');
Route::get('/branches/{id}', [BranchController::class, "availableBranches"])->name("branches");
Route::get('/about', fn() => Inertia::render('Info/about'));
Route::get('/pricing', fn() => Inertia::render('Info/Pricing'));
Route::get('/contact', fn() => Inertia::render('Info/Contact'));


// login / signup
Route::get('/login', fn() => Inertia::render('Login'))->name('login');
Route::get('/signup', [UserController::class, "showSignup"])->name('signup');
Route::get('/banks/{bank}/branches/{branch}/signup', [UserController::class, "showSignup"])->name('branchsignup');



Route::post('/signup', [UserController::class, 'storeUsers'])->name('signup');
Route::post('/login', [UserController::class, 'login'])->name('submitlogin');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');


Route::middleware('auth')->group(function () {
    Route::get('/settings', [SettingsController::class, 'index'])->name("settings");
    Route::post('/settings/updateprofile', [SettingsController::class, 'updateProfile'])->name("updateprofile");

    Route::post('/settings/profile_photo', [SettingsController::class, 'updatePhoto'])
        ->name('updateprofile-photo');
    Route::post('/settings/password/request', [SettingsController::class, 'updatePasswordRequest'])->name("passwordupdaterequest");
    Route::post('/settings/password/verify', [SettingsController::class, 'confirmPasswordUpdate'])->name("passwordupdateconfirm");

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

        Route::get('/bankadmin/{id}', [BankController::class, 'createAdmin'])
            ->name('create.admin');

        Route::post('/bankadmin', [UserController::class, 'bankAdmin'])
            ->name('bank.admin');
        Route::get("/alladmins", [BankController::class, 'Alladmins'])->name('allbankadmins');
        Route::patch('/bankadmins/{user}/status', [BankController::class, 'toggleStatus'])
            ->name('bankadmin.status');

        Route::delete('/bankadmins/{user}', [BankController::class, 'destroy'])
            ->name('bankadmin.delete');

        Route::delete('/bankadmins/delete/{bank}', [BankController::class, 'deletebank'])
            ->name('delete');
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

    Route::post('/create/branch', [BranchController::class, 'store'])->name('storebranch');

    Route::get('/branch/{branch}/admin', [BranchController::class, 'branchAdmin'])
        ->name('createbranchadmin');

    Route::patch('/branch/{branch}/update', [BranchController::class, 'update'])
        ->name('updatebranch');

    Route::delete('/branch/{user}/delete', [BranchController::class, 'destroyAdmin'])
        ->name('deletebranch');
    Route::patch('/branch/{user}/status', [BankController::class, 'toggleStatus'])
        ->name('togglestatusbranchadmin');
    Route::post('/create', [UserController::class, 'branchAdmin'])
        ->name('storeBranchAdmin');
    Route::get('/profile', [BankProfileController::class, 'show'])->name('bankprofile');

    Route::patch('/profile/general', [BankProfileController::class, 'updateGeneral'])->name("bank.profile.general");
    Route::post('/profile/branding', [BankProfileController::class, 'updateBranding'])->name("bank.profile.branding");
    Route::patch('/profile/contact', [BankProfileController::class, 'updateContact'])->name("bank.profile.contact");
    Route::patch('/profile/settings', [BankProfileController::class, 'updateSettings']);

    Route::delete('/delete/admin/{user}', [BranchController::class, 'destroyAdmin'])->name("branch.delete");
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

    Route::get("/role", fn() => inertia("Admin2/CreateRole"));

    Route::post("/createzone", [UserController::class, 'zonesave'])
        ->name("savezone");

    Route::get('branchadmin/create', fn() => Inertia::render('Admin2/CreateStaff'))
        ->name("createstaff");

    Route::get("branchadmin/createzone", fn() => Inertia::render('Admin2/CreateZone'))
        ->name('createzone');
});



/*
|--------------------------------------------------------------------------
| ZONE / AGENT MANAGEMENT
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    // ZONE / AGENT MANAGEMENT
    Route::get('available/agents', [ZoneController::class, 'agents']);
    Route::get('available/zones', [ZoneController::class, 'Zones']);
    Route::post('assign/zones', [ZoneController::class, 'assignZones'])->name("assignAgents");
    Route::post('deassign/zones', [ZoneController::class, 'deassignZone'])->name("deassignagent");

    // BANK USERS
    Route::get('/bank/users/pending', [UserController::class, 'pending'])
        ->name('bank.users.pending');
    Route::post('/bank/users/{user}/approve', [UserController::class, 'approve'])
        ->name('bank.users.approve');
    Route::post('/bank/users/{user}/reject', [UserController::class, 'reject'])
        ->name('bank.users.reject');

    // BRANCH USERS
    Route::get('/branch/users/view/{user}', [BranchController::class, "viewUserInfo"])->name("branch.users.view");

    // BRANCH STAFF
    Route::get('/branch/staff', [BankBranchController::class, "branchStaffs"])->name("branchStaff");
    Route::get('/branch/loaninfo',  [AccountantCOntroller::class, "LoanInfo"])->name('branchloaninfo');
    Route::get('/accountant/transactions/search', [AccountantCOntroller::class, 'search'])
        ->name('account.search');
    Route::get('/accountant/transactions/create', [TransactionController::class, 'create'])
        ->name('transactions.create');

    Route::post('/accountant/transactions', [TransactionController::class, 'store'])
        ->name('accountant.transactions.store');
});


/*
|--------------------------------------------------------------------------
| LOAN OFFICER ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('loanadmindashboard')->group(function () {

    Route::get('/', [LoanController::class, 'getLoanStats'])
        ->name('loanadmindashboard');
    Route::get('/requests', [LoanController::class, "showRequests"])->name('showrequests');


    Route::post("loan/status/{id}", [LoanController::class, "changeStatus"])
        ->name("changeStatus");

    Route::resource('loan', LoanController::class);
});

/*
|--------------------------------------------------------------------------
| BRANCH USERS MANAGEMENT
|--------------------------------------------------------------------------
*/
Route::middleware("auth")->group(
    function () {
        Route::get('/available/branchusers', [BranchController::class, 'availableusers']);
        Route::get('allbranch/users', fn() => Inertia::render('Admin2/AvailableUsers'))
            ->name('availableusers');
        Route::patch('/branch/{user}/status', [BankController::class, 'toggleStatus'])
            ->name('toggleuserStatus');
    }
);


/*
|--------------------------------------------------------------------------
| AGENT ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix("agentadmindashboard")->group(

    function () {


        Route::get('/agent/clients', [AgentController::class, 'agentclients']);
        Route::post('/assign/userzone', [AgentController::class, 'alterusers'])
            ->name("alterZone");

        Route::post("/remove/userszone", [AgentController::class, 'removeuserzone'])
            ->name("removeZone");
        Route::get('/', fn() => Inertia::render('Agent/Agentdashboard'))
            ->name('agentadmindashboard');
    }
);
/*
|--------------------------------------------------------------------------
| ACCOUNTANT ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('accountantdmindashboard')->group(function () {
    Route::get('/',  [AccountantCOntroller::class, "getDashboard"])->name('accountadmindashboard');
    Route::get('/dashbo',  fn()=>Inertia::render("Accountant/AccountantDashboard"))->name('accountadd');
    Route::get('/repayments', [AccountantController::class, 'repayments'])
        ->name('loan.repayments');


    Route::get(
        '/loans/{loan}/repayments',
        [AccountantController::class, 'repaymentHistory']
    )->name('repayments.history');


    Route::get('/transactions', [AccountantController::class, 'transactions'])
        ->name('accountant.transactions');
});


/*
|--------------------------------------------------------------------------
| SUPPORT OFFICER ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('supportadmindashboard')->group(function () {
    Route::get('/', [AccountantCOntroller::class, "getDashboard"])->name('supportadmindashboard');
});



/*
|--------------------------------------------------------------------------
| USER DASHBOARD + ACCOUNT MANAGEMENT
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'check_permission:view_dashboard_user'])
    ->prefix('mydashboard')
    ->group(function () {

        Route::get('/', fn() => Inertia::render('User/Userdashboard'))
            ->name('userdashboard');

        Route::get('account/ballance', [BallanceController::class, 'getBalance'])
            ->middleware('ajax.only');

        Route::get("/transactions", fn() => Inertia::render("User/UserTransactions"))->name("getransaction");

        Route::post('/addballance', [BallanceController::class, 'addballance'])
            ->name("newballance");
        Route::get("/loan-status", [LoanController::class, "loanStatus"]);
        Route::get("/loandashboard", fn() => Inertia::render("User/LoanDashboard"))->name("userloanservices");
        Route::get('/loan-repayments', [LoanRepayController::class, 'repaymentHistory']);

        Route::get("/loan-repaymentpage", fn() => Inertia::render("User/LoanRepayment"))->name("loanrepayment");
        Route::post("/user/apply", [LoanController::class, 'applyloan'])
            ->name("loan.apply");
        Route::get("/getloanapplication", [LoanController::class, "index"])->name("getloanapplication");
        Route::post('/kyc/submit', [UserKycController::class, 'submit'])
            ->name('kyc.submit');
        Route::get("/yourkyc", [UserKycController::class, "MyKyc"])->name("userkycpage");
        Route::resource('loan', LoanController::class);
        Route::get('request/bank', [BankBranchController::class, "index"])->name('user.requestbank');
        Route::post('request/bank', [BankBranchController::class, "Store"])->name('branch-requests.store');
        // web.php
        Route::post('/branch-requests/cancel/{user}', [BankBranchController::class, 'cancelRequest'])->name('branch-requests.cancel');
    });


/*
|--------------------------------------------------------------------------
| STAFF CREATION UNDER BRANCH
|--------------------------------------------------------------------------
*/
Route::post('/branchadmin/createstaff', [UserController::class, 'storeStaff'])
    ->name("branch_staff");
