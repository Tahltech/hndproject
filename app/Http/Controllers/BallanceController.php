<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class BallanceController extends Controller
{
    /**
     * shows accout information on the user dashboard
     */
    public function Ballance(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $user = Auth::user()->user_id;

        /** @var \Illuminate\Database\Query\Builder $query */
        $ballance = DB::table('users')
            ->join('accounts', 'users.user_id', '=', 'accounts.user_id')
            ->where('users.user_id', $user)
            ->select('users.username as username', 'accounts.balance as ballance')
            ->get();


        return response()->json([
            'ballance' => $ballance
        ]);
    }

    public function addballance(Request $request)
    {
        $ballance = $request->validate([
            'method' => 'required|min:1',
            'mobileNumber' => 'required|min:9',
            'amount' => 'required|numeric',
        ]);

        if ($ballance['method'] === 'Mobile Money') {




            // return back()->with('success', 'Payment method is Mobile Money');
        } elseif ($ballance['method'] === 'Orange Money') {
            // dd('hello om');

            //return back()->with('success', 'Payment method is Orange Money');
        } else {
            return back()->with('error', 'Invalid payment method');
        }
        $userId = Auth::user()->user_id;
        $amount = $ballance['amount'];

        if ($amount < 50) {
            return redirect()->route("addballance")->with('error', "Amount can't be less than 50 XAF");
        }
        $account = Account::where('user_id', $userId)->first();
       
        if ($account) {
            // Increment existing balance
            $account->balance += $amount;
            $account->save();
        } else {
            // Create new account record
            Account::create([
                'user_id' => $userId,
                'amount' => $amount,
            ]);
        }
         $acountId= $account->account_id;



       // dd($acountId);
        //create transaction

        Transaction::create([
            'account_id' => $acountId,
            'agent_id'    => 1,
            'type' => 'deposit',
            'method' => 'mtn_momo',
            'amount' => $amount,
            'status' => 'success',
            'reference_no'=> '0000',
            'remarks' => 'thanks for using our website pay',

        ]);

        return redirect()->route('userdashboard')->with('success', 'Balance added successfully!');
    }



    public function withdrawballance(Request $request)
    {
        $ballance = $request->validate([
            'method' => 'required|min:1',
            'mobileNumber' => 'required|min:9',
            'amount' => 'required|numeric',
        ]);

        if ($ballance['method'] === 'Mobile Money') {




            // return back()->with('success', 'Payment method is Mobile Money');
        } elseif ($ballance['method'] === 'Orange Money') {
            // dd('hello om');

            //return back()->with('success', 'Payment method is Orange Money');
        } else {
            return back()->with('error', 'Invalid payment method');
        }
        $userId = Auth::user()->user_id;
        $amount = $ballance['amount'];

        if ($amount < 50) {
            return redirect()->route("withdraw")->with('error', "Amount can't be less than 50 XAF");
        }
        $account = Account::where('user_id', $userId)->first();
        if ($account->balance < $amount) {
            return redirect()->route("withdraw")->with('error', 'Insufficient ballace add savings to withdraw');
        }

        if ($account) {
            // Increment existing balance
            $account->balance -= $amount;
            $account->save();
        } else {
            // Create new account record
            Account::create([
                'user_id' => $userId,
                'amount' => $amount,
            ]);
        }

        //create transaction

        Transaction::create([
            'account_id' => $account->account_id,
            'agent_id'    => 1,
            'type' => 'withdrawal',
            'method' => 'mtn_momo',
            'amount' => $amount,
            'status' => 'success',
            'reference_no'=> '0000',
            'remarks' => 'thanks for using our website pay',

        ]);

        return redirect()->route('userdashboard')->with('success', 'Balance Withdrawn Successfully!');
    }
}
