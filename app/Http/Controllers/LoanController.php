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
            'amount' => "required||numeric",
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


        if ($balance > 5000) {

            if ($amount < $balance) {
                $account->balance = $account->balance + $amount;
                $account->save();

                Loan::create([
                    "account_id" => $account->account_id,
                    "principal_amount" => $amount,
                    "interest_rate" => "10",
                    "repayment_period" => "2",
                    "status" => "pending",
                ]);

                return redirect()->route("loan.index")->with("success", "Loan requested Succesfully wait a minute for its approval");
            }

            return Inertia::render("Loan/LoanApplication");
        } else {
            return redirect()->route("loan.index")->with("error", "Sorry you are not eligeable for this loan, try again Later");
        }
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
    }
    public function getLoans()
    {
        $branchId = Auth::user()->branch_id;

        $loans = Loan::whereHas('account.user', function ($query) use ($branchId) {
            $query->where('branch_id', $branchId);
        })->with([
            'account.user',
        ])->get();

        return inertia('Loan/LoanAdminDashbaord', [
            'loanRequests' => $loans
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

        $loan->status = $validated["status"];
        $loan->save();

        return back()->with('success', "Loan {$validated['status']} successfully");
    }


    public function show($id)
    {

        $loan = Loan::with('account.user')->findOrFail($id);


        return Inertia::render("Loan/LoanDetails", ['loan' => $loan]);
    }
}
