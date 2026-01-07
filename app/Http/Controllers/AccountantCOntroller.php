<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Loan;

use Inertia\Inertia;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Models\LoanRepayment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AccountantCOntroller extends Controller
{

    public function search(Request $request)
    {
        $search = $request->search;

        return Account::with('user')
            ->whereHas('user', function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get();
    }

    public function getDashboard()
    {
        // Calculate weekly transactions (last 7 days)
        $weeklyTransactions = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = Carbon::today()->subDays($i);

            $weeklyTransactions[] = [
                'day' => $day->format('D'), // Mon, Tue, ...
                'in'  => Transaction::whereDate('created_at', $day)
                    ->where('type', 'deposit')
                    ->where('status', 'success')
                    ->sum('amount'),
                'out' => Transaction::whereDate('created_at', $day)
                    ->where('type', 'withdrawal')
                    ->where('status', 'success')
                    ->sum('amount'),
            ];
        }

        return Inertia::render('Accountant/Dashboard', [
            'stats' => [
                // MONEY IN
                'totalIn' => Transaction::where('type', 'deposit')
                    ->where('status', 'success')
                    ->sum('amount'),

                // MONEY OUT
                'totalOut' => Transaction::where('type', 'withdrawal')
                    ->where('status', 'success')
                    ->sum('amount'),

                // CHANNELS
                'cashIn' => Transaction::where('type', 'deposit')
                    ->where('method', 'cash')
                    ->where('status', 'success')
                    ->sum('amount'),

                'momoIn' => Transaction::where('type', 'deposit')
                    ->whereIn('method', ['mtn_momo', 'orange_money'])
                    ->where('status', 'success')
                    ->sum('amount'),

                // LOANS
                'loanDisbursed' => Transaction::where('type', 'withdrawal')
                    ->where('remarks', 'LIKE', '%Loan disbursement%')
                    ->where('status', 'success')
                    ->sum('amount'),

                // TODAY
                'todayIn' => Transaction::whereDate('created_at', Carbon::today())
                    ->where('type', 'deposit')
                    ->where('status', 'success')
                    ->sum('amount'),

                'todayOut' => Transaction::whereDate('created_at', Carbon::today())
                    ->where('type', 'withdrawal')
                    ->where('status', 'success')
                    ->sum('amount'),

                // WEEKLY TRANSACTIONS
                'weeklyTransactions' => $weeklyTransactions,
            ]
        ]);
    }

    public function transactions(Request $request)
    {
        $search = $request->input('search');

        $query = Transaction::with(['account.user', 'agent'])->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('account.user', function ($q2) use ($search) {
                    $q2->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%");
                })
                    ->orWhere('reference_no', 'like', "%{$search}%");
            });
        }

        $transactions = $query->paginate(5)->withQueryString();

        return Inertia::render('Accountant/Transactions', [
            'transactions' => $transactions
        ]);
    }





    public function LoanInfo()
    {


        $totalDisbursed = Loan::where('status', 'approved')
            ->sum('principal_amount');

        $totalRepaid = LoanRepayment::where('status', 'paid')
            ->sum('amount');

        $outstanding = $totalDisbursed - $totalRepaid;

        $overdue = LoanRepayment::where('status', 'overdue')
            ->sum('amount');

        $interest = Loan::where('status', 'approved')
            ->sum(DB::raw('principal_amount * (interest_rate / 100)'));

        $stats = [
            'totalDisbursed'   => $totalDisbursed,
            'totalRepaid'      => $totalRepaid,
            'outstanding'      => $outstanding,
            'overdue'          => $overdue,
            'interest'         => round($interest),
            'activeLoans'      => Loan::where('status', 'approved')->count(),
            'completedLoans'   => Loan::where('status', 'completed')->count(),
            'defaultedLoans'   => Loan::where('status', 'defaulted')->count(),
        ];



        $monthlyRepayments = LoanRepayment::select(
            DB::raw('MONTHNAME(created_at) as month'),
            DB::raw('SUM(amount) as amount')
        )
            ->where('status', 'paid')
            ->groupBy(DB::raw('MONTH(created_at)'), DB::raw('MONTHNAME(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();



        $loanStatusStats = Loan::select(
            'status',
            DB::raw('COUNT(*) as value')
        )
            ->groupBy('status')
            ->get();

        return Inertia::render('Accountant/AccountantDashboard', [
            'stats'             => $stats,
            'monthlyRepayments' => $monthlyRepayments,
            'loanStatusStats'   => $loanStatusStats,
        ]);
    }



    public function repayments()
    {
        $branchId = Auth::user()->branch_id;

        $loans = Loan::with([
            'account.user',
            'repayments',
        ])
            ->whereHas(
                'account.user',
                fn($q) =>
                $q->where('branch_id', $branchId)
            )
            ->get()
            ->map(function ($loan) {
                $totalRepaid = $loan->repayments->sum('amount');
                $balance = ($loan->principal_amount ?? 0) - $totalRepaid;

                $dueDate = Carbon::parse($loan->created_at)
                    ->addMonths($loan->repayment_period);

                $status =
                    $balance <= 0
                    ? 'completed'
                    : (now()->gt($dueDate) ? 'overdue' : 'ongoing');

                return [
                    'id' => $loan->loan_id,
                    'borrower' => $loan->account->user->full_name ?? 'N/A',
                    'amount' => $loan->principal_amount,
                    'repaid' => $totalRepaid,
                    'balance' => $balance,
                    'due_date' => $dueDate->toDateString(),
                    'status' => $status,
                ];
            });

        return Inertia::render('Accountant/RepaymentTracking', [
            'repayments' => $loans,
        ]);
    }

    public function repaymentHistory($loanId)
    {
        $loan = Loan::with([
            'account.user',
            'repayments' => fn($q) => $q->orderBy('created_at', 'desc'),
        ])->findOrFail($loanId);

        $totalRepaid = $loan->repayments->sum('amount');
        $balance = ($loan->principal_amount ?? 0) - $totalRepaid;

        return Inertia::render('Accountant/RepaymentHistory', [
            'loan' => [
                'id' => $loan->loan_id,
                'borrower' => $loan->account->user->full_name ?? 'N/A',
                'amount' => $loan->principal_amount,
                'repaid' => $totalRepaid,
                'balance' => $balance,
            ],
            'repayments' => $loan->repayments,
        ]);
    }
}
