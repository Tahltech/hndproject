<?php

use App\Http\Controllers\BallanceController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BankController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ZoneController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');
Route::get("/login", function () {
    return Inertia::render('Login');
})->name('login');
//
Route::get("/signup", function () {
    return inertia('Signup');
})->name('signup');

//the it user accout creation route
Route::post('signup', [UserController::class, 'storeUsers'])->name('signup');

//loging in 
Route::post('/login', [UserController::class, 'login'])->name('submitlogin');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

//it admin routes and operation includding creating banks
Route::get('/Itadmindashboard', function () {
    return Inertia::render('Admin/Admindashboard');
})->middleware(['auth', 'check_permission:view_dashboard_it_admin'])->name(('admindashboard'));
/**
 * this gets the it admin dashbaord and all operations done by the it admin
 */
Route::get('/Itadmindashboard/create', function () {
    return Inertia::render('Admin/CreateBank');
})->middleware(['auth', 'check_permission:view_dashboard_it_admin'])->name(('createbank'));
//creates a bank
Route::post('/Itadmindashboard/create', [BankController::class, 'store'])->name("newbank");
//gets all banks created by the it admin
Route::get('/admin/banks', [BankController::class, 'index'])->name('admin.banks');
//creatw
// Route::post('/Itadmindashboard/bankadmin', [BankController::class, 'create'])->name('user.create');
//gets the page to create the it admin
Route::get('/Itadmindashboard/bankadmin{id}', [BankController::class, 'createAdmin'])->name('create.admin');
//creates the it admin page
Route::post('/Itadmindashboard/bankadmin', [UserController::class, 'bankAdmin'])->name('bank.admin');

/**
 * involves the banks admin information and what they can do
 * 
 *  */
//gets the banks admin dashboard when they login
Route::get('/bnkadmindashboard', function () {
    return Inertia::render('Admin1/Admindashboard');
})->name('bnkadmindashboard');
//gets the page that helps them to create a branch
Route::get('/bnkadmindashboard/create', function () {
    return Inertia::render('Admin1/CreateBranch');
})->name('createbranch');
//stores or creates the branch account under their bank
Route::post('/bnkadmindashboard/create', [BranchController::class, 'store'])->name('storebranch');
//gets the page for them to create the branch admin of that branch 
Route::get('/branchadmindashboard/create/{id}', [BranchController::class, 'branchAdmin'])->name('createbranchadmin');
//gets the available branches under the the bank like any bank created by that branch 
Route::get('/available/branch', [BranchController::class, 'index']);
//ceating accouts for branch admins
Route::post('/branchadmindashboard/create', [UserController::class, 'branchAdmin'])->name('storeBranchAdmin');


/**
 * gets information about the branch and what the branch admin can do 
 */
//gets the branch admin dashboard for the admins when they log in 
Route::get('/branchadmindashboard', function () {
    return Inertia::render('Admin2/Admindashboard');
})->middleware('auth')->name('branchadmindashboard');
Route::get('branchadmin/create', function () {
    return Inertia::render('Admin2/CreateStaff');
})->name("createstaff");
Route::get("/branchadmindashboard/role", function(){
    return inertia("Admin2/CreateRole");
});
Route::get("branchadmin/createzone", function(){
    return Inertia::render('Admin2/CreateZone');
})->name('createzone');

//use to create zones
Route::post("branchadmindashboard/createzone",[UserController::class, 'zonesave'])->name("savezone");
//displaying the available agents 
Route::get('available/agents',[ZoneController::class, 'agents']);
/**
 * gets information about the loan officer and what they can do on the site 
 */
//loan officer dashboard
Route::get('/loanadmindashboard', function () {
    return Inertia::render('Admin1/Admindashboard');
})->name('loanadmindashboard');

/**
 * gets the accountant dashboard and what they can do 
 */
//accountant dashboard
Route::get('/accountadmindashboard', function () {
    return Inertia::render('Admin1/Admindashboard');
})->name('accountadmindashboard');


/**
 * gets the suport officers dashboard and what they can do with the accounts
 */
//suport officer dashboard 

Route::get('/supportadmindashboard', function () {
    return Inertia::render('Admin1/Admindashboard');
})->name('supportadmindashboard');


/**
 * gets the agent dashbaord and what they can do with their accounts and so 
 */
//agent dashboard

Route::get('agentadmindashboard', function () {
    return Inertia::render('Agent/Agentdashboard');
})->name('agentadmindashboard');

/**
 * gets the user dashboard and what they can do with thier acounts 
 */

//for user dashboard 
Route::middleware(['auth', 'check_permission:view_dashboard_user'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('User/Userdashboard');
    })->name('userdashboard');
});
//getting account ballance
Route::get('account/ballance', [BallanceController::class, 'Ballance'])->name('ballance');

//adding money to the account
Route::middleware(['auth', 'check_permission:view_dashboard_user'])->group(function () {
    Route::get('/dashboard/addlballance', function () {
        return Inertia::render('User/AddBallance');
    })->name('addballance');
});
Route::post('/addballance',[BallanceController::class,'addballance'])->name("newballance");
//withdrawing money from the account

Route::middleware(['auth', 'check_permission:view_dashboard_user'])->group(function () {
    Route::get('/dashboard/withdraw', function () {
        return Inertia::render('User/WithdrawBallance');
    })->name('withdraw');
});
/**
 * withdrawing from the main ballance
 */
Route::post('/withdraw',[BallanceController::class,'withdrawballance'])->name("withdrawballance");
/**
 * a branch admin creating the branch's staff
 */
Route::post('/branchadmin/createstaff',[UserController::class, 'storeStaff'])->name("branch_staff");
