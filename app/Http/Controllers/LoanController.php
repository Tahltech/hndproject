<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Account;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\App\Http\Controllers\TransactionController;

class LoanController extends Controller
{
    //checking if a user is eligeable for loan 

    public function index()
    {
        //gets the loans page 
        return Inertia::render('User/LoanDashboard');
    }
    public function store(Request $request)
    {

        $request->validate([
            'amount' => "required||numeric"
        ]);

        $amount = $request->amount;
        if ($amount < 1000) {
            return redirect()->route("loan.index")->with("error", "amount can not be less than 1000");
        }

        $user = Auth::user();
        $userId = $user->user_id;
        $account = Account::where("user_id", $userId)->first();
        $balance = $account ? $account->balance : 0;

        $userCreationDate = $user->created_at;
        $monthsSpent = Carbon::parse($userCreationDate)->diffInMonths(Carbon::now());

        //dd($balance);

        if ($balance > 5000) {

            if ($amount < $balance) {
                $account->balance = $account->balance + $amount;
                $account->save();
            }


            Loan::create([
                "account_id" => $account->account_id,
                "principal_amount" => $amount,
                "interest_rate" => "10",
                "repayment_period" => "2",
                "status" => "pending",
            ]);



            return redirect()->route("loan.index")->with("success", "Loan requested Succesfully wait a minute for its approval");
        } else {
            return redirect()->route("loan.index")->with("error", "Sorry you are not eligeable for this loan, try again Later");
        }
    }
    public function getLoans()
    {
        $branchId = Auth::user()->branch_id;

        $loans = Loan::whereHas('account.user', function ($query) use ($branchId) {
            $query->where('branch_id', $branchId);
        })->with([
            'account.user',
        ])->get();

        // foreach ($loans as $loan) {
        //     dump([
        //         'loan_id' => $loan->loan_id ?? $loan->id,
        //         'account' => $loan->account,
        //         'user' => optional($loan->account)->user,
        //     ]);
        // }

        // dd('done');

        return inertia('Loan/LoanAdminDashbaord', [
            'loanRequests' => $loans
        ]);
    }
}
