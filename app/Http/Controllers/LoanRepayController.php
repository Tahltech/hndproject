<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;
use App\Models\LoanRepayment;
use Illuminate\Support\Facades\Auth;

class LoanRepayController extends Controller
{
    public function repaymentInfo()
    {
        $user = Auth::user();
        $account = $user->account;

        if (!$account) {
            return response()->json(['loan' => null]);
        }

        $loan = Loan::where('account_id', $account->account_id)
            ->whereIn('status', ['approved', 'pending'])
            ->with('repayments')
            ->first();

        if (!$loan) {
            return response()->json(['loan' => null]);
        }

        $interest = $loan->principal_amount * ($loan->interest_rate / 100);
        $totalPayable = $loan->principal_amount + $interest;

        $totalPaid = $loan->repayments()
            ->where('status', 'paid')
            ->sum('amount');

        $remaining = max($totalPayable - $totalPaid, 0);

        return response()->json([
            'loan' => [
                'loan_id' => $loan->loan_id,
                'principal' => $loan->principal_amount,
                'interest_rate' => $loan->interest_rate,
                'totalPayable' => $totalPayable,
                'paid' => $totalPaid,
                'remaining' => $remaining,
                'status' => $loan->status,
            ]
        ]);
    }

    public function repayLoan(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:500',
            'repayment_method' => 'required|string'
        ]);

        $user = Auth::user();
        $account = $user->account;

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 400);
        }

        $loan = Loan::where('account_id', $account->account_id)
            ->whereIn('status', ['approved', 'pending'])
            ->first();

        if (!$loan) {
            return response()->json(['message' => 'No active loan'], 400);
        }

        $interest = $loan->principal_amount * ($loan->interest_rate / 100);
        $totalPayable = $loan->principal_amount + $interest;

        $totalPaid = LoanRepayment::where('loan_id', $loan->loan_id)
            ->where('status', 'paid')
            ->sum('amount');

        $remaining = $totalPayable - $totalPaid;

        if ($request->amount > $remaining) {
            return response()->json(['message' => 'Amount exceeds remaining balance'], 400);
        }

        if ($account->balance < $request->amount) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        // Deduct balance
        $account->balance -= $request->amount;
        $account->save();

        // Create transaction
        $transaction = $account->transactions()->create([
            'type' => 'withdrawal',
            'amount' => $request->amount,
            'method' => 'loan_repayment',
        ]);


        LoanRepayment::create([
            'loan_id' => $loan->loan_id,
            'transaction_id' => $transaction->transaction_id,
            'amount' => $request->amount,
            'amount_due' => $remaining - $request->amount,
            'status' => 'paid',
            'repayment_method' => $request->repayment_method,
        ]);


        if (($remaining - $request->amount) <= 0) {
            $loan->status = 'completed';
            $loan->save();
        }

        return response()->json([
            'message' => 'Repayment successful',
            'remaining' => max($remaining - $request->amount, 0),
            'loan_status' => $loan->status
        ]);
    }

    public function repaymentHistory()
    {
        $user = Auth::user();
        $account = $user->account;

        if (!$account) {
            return response()->json([
                'repayments' => [],
                'activeLoans' => [],
                'totalRepayable' => 0,
                'totalPaid' => 0,
                'remaining' => 0,
            ]);
        }

        // Get only active loans (approved)
        $loans = Loan::where('account_id', $account->account_id)
            ->where('status', 'approved')
            ->with('repayments')
            ->get();

        $totalRepayable = 0;
        $totalPaid = 0;
        $allRepayments = [];

        $activeLoans = $loans->map(function ($loan) use (&$totalRepayable, &$totalPaid, &$allRepayments) {
            $loanTotal = $loan->principal_amount + ($loan->principal_amount * ($loan->interest_rate / 100));
            $paid = $loan->repayments()->where('status', 'paid')->sum('amount');
            $remainingLoan = max($loanTotal - $paid, 0);

            // Add to totals
            $totalRepayable += $loanTotal;
            $totalPaid += $paid;

            // Collect repayments for this loan
            $loan->repayments->each(function ($repayment) use (&$allRepayments) {
                $allRepayments[] = [
                    'repayment_id' => $repayment->repayment_id,
                    'loan_id' => $repayment->loan_id,
                    'amount' => $repayment->amount,
                    'amount_due' => $repayment->amount_due,
                    'status' => $repayment->status,
                    'repayment_method' => $repayment->repayment_method ?? 'Balance',
                    'date' => $repayment->created_at->format('d M Y'),
                ];
            });

            return [
                'loan_id' => $loan->loan_id,
                'principal_amount' => $loan->principal_amount,
                'total_with_interest' => $loanTotal,
                'paid' => $paid,
                'remaining' => $remainingLoan,
                'status' => $loan->status,
                'duration' => $loan->repayment_period,
            ];
        });

        $remaining = max($totalRepayable - $totalPaid, 0);

        return response()->json([
            'repayments' => $allRepayments,
            'activeLoans' => $activeLoans,
            'totalRepayable' => $totalRepayable,
            'totalPaid' => $totalPaid,
            'remaining' => $remaining,
        ]);
    }
}
