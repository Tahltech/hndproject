<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
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

        $user = Auth::user();
        $account = Account::where('user_id', $user->user_id)->first();

        if (!$account) {
            return response()->json([
                'balance' => 0,
                'transactions' => [],
                'latestTransaction' => null,
            ]);
        }

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

    public function addballance(Request $request, RabbitMaidService $rabbitMaid, PHPMailerService $mailer)
    {
        $data = $request->validate([
            'method'       => 'required',
            'mobileNumber' => 'required|min:9',
            'amount'       => 'required|numeric|min:50',
            'type'         => 'required|in:credit,debit',
        ]);
        $user = Auth::user();
        /** @var \App\Models\User $user */
        if (!$user || !$user->hasBank()) {
            return redirect()->back()->with(
                'error',
                'You must be assigned to a bank to perform this action'
            );
        }
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


        try {
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
         $transaction=   Transaction::create([
                'account_id'   => $account->account_id,
                'agent_id'     => $userId,
                'type'         => $method,
                'method'       => $methodSaved,
                'amount'       => $amount,
                'status'       => 'success',
                'reference_no' => $reference,
                'remarks'      => 'Done VIA RabbitMaid API',
            ]);
            $user = Auth::user();

            $emailBody = view('emails.transactions', [
                'user' => $user,
                'transaction'=>$transaction,
            ])->render();

            $mailer->sendEmail(
                $user->email,
                'Transaction with' . $user->bank->name,
                $emailBody
            );

            return back()->with('success', ucfirst($method) . " successful! Ref: $reference");
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
}
