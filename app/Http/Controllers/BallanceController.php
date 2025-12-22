<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Services\PHPMailerService;
use Illuminate\Support\Facades\DB;
use App\Services\RabbitMaidService;
use Illuminate\Support\Facades\Auth;


class BallanceController extends Controller
{
    /**
     * shows accout information on the user dashboard
     */
    public function getBalance()
    {
        // get the logged-in user
        $user = Auth::user();
        $account = Account::where('user_id', $user->user_id)->first();
        $transactions = Transaction::where('account_id', $account->account_id)->latest()->take(5)->get();

        $latestTransaction = $user->account?->transactions()->latest()->first();
        if (!$account) {
            return response()->json([
                'balance' => 0,
            ]);
        }
        return response()->json([
            'ballance' => $account->balance,
            'transactions' => $transactions,
            'latestTransaction' => $latestTransaction,
        ]);
    }

    public function addballance(Request $request, RabbitMaidService $rabbitMaid)
    {
        $data = $request->validate([
            'method'       => 'required',
            'mobileNumber' => 'required|min:9',
            'amount'       => 'required|numeric|min:50',
            'type'         => 'required|in:credit,debit',
        ]);

        //dd($data['type']);

        $userId = Auth::user()->user_id;
        $amount = $data['amount'];

        // Payment method
        if ($data['method'] === 'MobileMoney') {
            $service = 'mtn';
            $methodSaved = 'mtn_momo';
        } elseif ($data['method'] === 'OrangeMoney') {
            $service = 'orange';
            $methodSaved = 'orange_money';
        } else {
            return back()->with('error', 'Invalid payment method');
        }

        // Call API

        //dd($service, $amount);
        $response = $rabbitMaid->transact($service, $data['type'], $amount);

        if (!$response->successful()) {
            return back()->with('error', 'Transaction failed');
        }

        $reference = $response->json()['reference'] ?? 'N/A';
        $account = Account::where('user_id', $userId)->first();

        //deposit
        if ($data['type'] === 'credit') {

            if (!$account) {
                $account = Account::create([
                    'user_id' => $userId,
                    'balance' => 0,
                ]);
            }

            $account->balance += $amount;
            $account->save();

            $method = 'deposit';
        }


        //WITHDRAW
        else {

            if (!$account) {
                return back()->with('error', 'No account found');
            }

            if ($account->balance < $amount) {
                return back()->with('error', 'Insufficient balance');
            }

            $account->balance -= $amount;
            $account->save();

            $method = 'withdrawal';
        }

        // Save transaction
        Transaction::create([
            'account_id'   => $account->account_id,
            'agent_id'     => $userId,
            'type'         => $method,
            'method'       => $methodSaved,
            'amount'       => $amount,
            'status'       => 'success',
            'reference_no' => $reference,
            'remarks'      => 'Done VIA RabbitMaid API',
        ]);

        return back()->with('success', ucfirst($method) . " successful! Ref: $reference");
    }
}
