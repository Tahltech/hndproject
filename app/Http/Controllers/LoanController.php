<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Loan;
use Inertia\Inertia;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\App\Http\Controllers\TransactionController;

class LoanController extends Controller
{
    //checking if a user is eligeable for loan 

    public function index()
    {

        return Inertia::render('User/LoanApplication');
    }

    public function loanStatus()
    {
        $user = Auth::user();
        $account = $user->account;

        if (!$account) {
            return response()->json([
                'eligible' => false,
                'loanLimit' => 0,
                'activeLoanTotal' => 0,
                'remainingLimit' => 0,
                'activeLoans' => [],
                'message' => 'No account found'
            ]);
        }
        $activeLoans = Loan::where('account_id', $account->account_id)
            ->whereIn('status', ['pending', 'approved'])
            ->get();
        $activeLoanTotal = $activeLoans->sum('principal_amount');
        $monthlyDeposits = $account->transactions()
            ->where('type', 'deposit')
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('amount');

        $balanceLimit = $account->balance * 2;
        $depositLimit = $monthlyDeposits * 2;

        $loanLimit = max($balanceLimit, $depositLimit);
        $remainingLimit = max($loanLimit - $activeLoanTotal, 0);


        $eligible = $remainingLimit >= 1000;

        return response()->json([
            'eligible' => true,
            'loanLimit' => $loanLimit,
            'activeLoanTotal' => $activeLoanTotal,
            'remainingLimit' => $remainingLimit,
            'activeLoans' => $activeLoans->map(fn($loan) => [
                'amount' => $loan->principal_amount,
                'status' => $loan->status,
                'duration' => $loan->repayment_period,
            ]),
            'message' => $eligible
                ? 'You are eligible for a loan'
                : 'Loan limit already reached'
        ]);
    }

    private function generateRepaymentSchedule(Loan $loan)
    {
        $monthlyAmount =
            ($loan->principal_amount +
                ($loan->principal_amount * $loan->interest_rate / 100))
            / $loan->repayment_period;

        for ($i = 1; $i <= $loan->repayment_period; $i++) {
            $loan->repayments()->create([
                'amount_due' => round($monthlyAmount, 2),
                'due_date' => Carbon::now()->addMonths($i),
            ]);
        }
    }
    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000',
        ]);

        $user = Auth::user();
        $account = Account::where('user_id', $user->user_id)->first();

        if (!$account) {
            return redirect()->back()->with('error', 'Account not found');
        }

        $requestedAmount = $request->amount;

        // ================= ACTIVE LOANS =================
        $activeLoans = Loan::where('account_id', $account->account_id)
            ->whereIn('status', ['pending', 'approved'])
            ->get();

        $activeLoanTotal = $activeLoans->sum('principal_amount');

        // ================= LOAN LIMIT =================
        $monthlyDeposits = $account->transactions()
            ->where('type', 'deposit')
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('amount');

        $balanceLimit = $account->balance * 2;
        $depositLimit = $monthlyDeposits * 2;

        $loanLimit = max($balanceLimit, $depositLimit);
        $remainingLimit = $loanLimit - $activeLoanTotal;

        // ================= VALIDATIONS =================
        if ($remainingLimit < 1000) {
            return redirect()->back()->with(
                'error',
                'Loan limit already reached. Active loans: ' . number_format($activeLoanTotal) . ' XAF'
            );
        }

        if ($requestedAmount > $remainingLimit) {
            return redirect()->back()->with(
                'error',
                'Requested amount exceeds your remaining loan limit (' .
                    number_format($remainingLimit) . ' XAF)'
            );
        }

        // ================= CREATE LOAN =================
        Loan::create([
            'account_id' => $account->account_id,
            'principal_amount' => $requestedAmount,
            'interest_rate' => 10,
            'repayment_period' => 2,
            'status' => 'pending',
        ]);

        return redirect()->route('loan.index')
            ->with('success', 'Loan request submitted successfully');
    }

    public function applyloan(Request $request)
    {
        $values = $request->validate([
            'amount' => "required|numeric|min:1000|max:1000000",
            'loan_purpose' => 'required|string|max:255',
            'repayment_period' => 'required|integer|min:1|max:36',
            'id_number' => "required|string|min:4|max:30",
            'address' => 'required|string|max:255',

            'g_full_name' => "required|string|max:255",
            'g_email' => "required|email|max:255",
            'g_phone' => "required|string|min:8|max:20",
            'g_id_number' => "required|string|min:4|max:30",
            'g_address' => "required|string|max:255",
        ]);
        try {
            $user = Auth::user();
            $userId = $user->user_id;
            $account = Account::where("user_id", $userId)->first();


            Loan::create([
                "account_id" => $account->account_id,
                "principal_amount" => $request->amount,
                "interest_rate" => "10",
                "loan_purpose" => $request->loan_purpose,
                "repayment_period" => $request->repayment_period,
                "id_number" => $request->id_number,
                "address" => $request->address,
                "g_full_name" => $request->g_full_name,
                "g_email" => $request->g_email,
                'g_phone' => $request->g_phone,
                'g_id_number' => $request->g_id_number,
                'g_address' => $request->g_address,
                "status" => "pending",
            ]);

            return redirect()->route("loan.index")->with("success", "Loan requested Succesfully wait  for its approval");
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
    public function showRequests(Request $request)
    {
        $branchId = Auth::user()->branch_id;

        // Get search query
        $search = $request->input('search');

        // Fetch loans for users in this branch
        $loanQuery = Loan::with(['account.user'])
            ->whereHas('account.user', function ($query) use ($branchId) {
                $query->where('branch_id', $branchId);
            })
            ->orderBy('created_at', 'desc'); // latest first

        // Apply search if provided
        if ($search) {
            $loanQuery->whereHas('account.user', function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        // Paginate results
        $loans = $loanQuery->paginate(10)->withQueryString();

        // Return to Inertia page
        return Inertia::render('Loan/LoanRequests', [
            'loans' => $loans
        ]);
    }

    public function getLoanStats()
    {
        $branchId = Auth::user()->branch_id;

        // Get all loans for users in this branch
        $loans = Loan::whereHas('account.user', function ($query) use ($branchId) {
            $query->where('branch_id', $branchId);
        })->with(['account.user'])->get();

        // Compute stats
        $totalLoanAmount = $loans->sum(fn($loan) => $loan->principal_amount ?? 0);
        $pending = $loans->where('status', 'pending')->count();
        $approved = $loans->where('status', 'approved')->count();
        $totalApproved = $loans
            ->where('status', 'approved')
            ->sum(fn($loan) => $loan->principal_amount ?? 0);

        // Monthly stats
        $monthlyStats = $loans->groupBy(function ($loan) {
            return Carbon::parse($loan->created_at)->format('M'); // Jan, Feb, etc.
        })->map(function ($loans, $month) {
            return [
                'month' => $month,
                'total' => $loans->sum(fn($l) => $l->principal_amount ?? 0),
                'approved' => $loans->where('status', 'approved')->sum(fn($l) => $l->principal_amount ?? 0),
                'pending' => $loans->where('status', 'pending')->sum(fn($l) => $l->principal_amount ?? 0),
            ];
        })->values();


        // Return data to Inertia
        return inertia('Loan/LoanAdminDashbaord', [
            'loanStats' => [
                'totalLoan' => $totalLoanAmount,
                'pending' => $pending,
                'approved' => $approved,
                'totalApproved' => $totalApproved,
            ],
            'monthlyStats' => $monthlyStats,
        ]);
    }


    public function changeStatus(Request $request, $id)
    {
        $validated = $request->validate([
            "status" => "required|in:approved,rejected",
        ]);

        $loan = Loan::findOrFail($id);

        if ($loan->status === "approved") {
            return back()->with('success', 'Loan already approved');
        }
        try {

            $loan->status = $validated["status"];
            $loan->save();
            $this->generateRepaymentSchedule($loan);
        } catch (\Throwable $th) {
            //throw $th;

            return back()->with('error', 'Error trying to proccess this loan Try agian later');
        }

        return back()->with('success', "Loan {$validated['status']} successfully");
    }


    public function show($id)
    {
        $loan = Loan::with([
            'account.user',
            'repayments'
        ])->where('loan_id', $id)->firstOrFail();

        return inertia('Loan/LoanDetails', [
            'loan' => $loan
        ]);
    }
}
