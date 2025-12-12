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
        // Get the logged-in user
        $user = Auth::user();
        // Find the account that belongs to this user
        $account = Account::where('user_id', $user->user_id)->first();
        // If no account exists, return 0
        if (!$account) {
            return response()->json([
                'balance' => 0,
            ]);
        }

        // Return balance
        return response()->json([
            'ballance' => $account->balance,
        ]);
    }


    public function addballance(Request $request, RabbitMaidService $rabbitMaid)
    {
        $ballance = $request->validate([
            'method' => 'required|min:1',
            'mobileNumber' => 'required|min:9',
            'amount' => 'required|numeric',
            'type' => 'required|max:6',
        ]);

        $userId = Auth::user()->user_id;
        $amount = $ballance['amount'];

        if ($amount < 50) {
            return redirect()->route("addballance")
                ->with('error', "Amount can't be less than 50 XAF");
        }

        // MTN or Orange
        if ($ballance['method'] === 'MobileMoney') {
            $service = 'mtn';
            $methodSaved = 'mtn_momo';
        } elseif ($ballance['method'] === 'OrangeMoney') {
            $service = 'orange';
            $methodSaved = 'orange_money';
        } else {
            return back()->with('error', 'Invalid payment method');
        }

        

        // Call RabbitMaid API through the service
        $response = $rabbitMaid->transact($service, 'credit', $amount);

        if (!$response->successful()) {
            $error = $response->json()['error'] ?? 'Transaction failed';
            return back()->with('error', $error);
        }

        $data = $response->json();
        $reference = $data['reference'] ?? 'N/A';
        // Save balance
        $account = Account::firstOrCreate(
            ['user_id' => $userId],
            ['balance' => 0]
        );
        if ($ballance['type'] === "credit") {


            $account->balance += $amount;
            $account->save();
        } else {
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
        }

        try {
            Transaction::create([
                'account_id'   => $account->account_id,
                'agent_id'     => $userId,
                'type'         => $ballance['type'],
                'method'       => $methodSaved,
                'amount'       => $amount,
                'status'       => 'success',
                'reference_no' => $reference,
                'remarks'      => 'Done VIA RabbitMaid API',
            ]);

            return redirect()
                ->route('userdashboard')
                ->with('success', "Deposit successful! Reference: $reference");
        } catch (\Throwable $th) {

            Log::error('Deposit transaction failed', [
                'error' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
            ]);


            return back()->with('error', 'Something went wrong while processing the deposit try again later .');
        }
    }

    //     public function testMail(PHPMailerService $mailer)
    //     {
    //         $sent = $mailer->sendEmail(
    //             'recipient@example.com',
    //             'Test Email',
    //             '<h1>Hello!</h1><p>This is a test email</p>'
    //         );

    //         if ($sent) {
    //             return "Email sent successfully!";
    //         }

    //         return "Email failed to send.";
    //     }
    // }
    // ✅


}
