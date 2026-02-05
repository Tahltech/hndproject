<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\PHPMailerService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AgentController extends Controller
{
    public function agentclients(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }
        // this display the list of available clients under their zone 
        $agent = Auth::user();


        $clients = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.role_id')
            ->where('users.zone_id', $agent->zone_id)
            ->where('users.branch_id', $agent->branch_id)
            ->where('roles.role_name', 'user')
            ->select('users.*')
            ->get();

        return response()->json([
            'clients' => $clients,
        ], 200);
    }


    /**
     * assigning users to zones by agents
     */

    public function alterusers(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
        ]);

        $agent = Auth::user();


        // Make sure agent has a zone
        if (empty($agent->zone_id)) {
            return back()->with('error', 'You do not have a zone assigned.');
        }

        $user = DB::table('users')->where('user_id', $request->user_id)->first();

        if (!$user) {
            return back()->with('error', 'User not found.');
        }
        if (!is_null($user->zone_id)) {
            // If the user is in **another zone**, prevent reassignment
            return back()->with('error', 'User is already assigned to another zone.');
        }
        if (!is_null($user->zone_id)) {
            return back()->with('error', 'This user already belongs to a zone.');
        }

        $user = DB::table('users')->where('user_id', $request->user_id)->first();

        if (!$user) {
            return back()->with('error', 'User not found.');
        }
        if (!is_null($user->zone_id)) {
            // If the user is in **another zone**, prevent reassignment
            return back()->with('error', 'User is already assigned to another zone.');
        }
        DB::table('users')
            ->where('user_id', $request->user_id)
            ->update([
                'zone_id' => $agent->zone_id,
            ]);

        return back()->with('success', 'User added to your zone successfully');
    }

    public function removeuserzone(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
        ]);


        $user = DB::table('users')->where('user_id', $request->user_id)->first();

        $agent = Auth::user();
        if ($user->zone_id != $agent->zone_id) {
            return back()->with('error', 'User not from your zone you cant take action contact user zone agent.');
        }


        DB::table('users')
            ->where('user_id', $request->user_id)
            ->update([
                'zone_id' => null,
            ]);

        return back()->with('success', 'User removed from your zone successfully');
    }
    public function Cashsavings(Request $request, PHPMailerService $mailer)
    {
        $data = $request->validate([
            "user_id" => "exists:users|exists:users,user_id",
            'type' => 'required|in:withdraw,deposit',
            'amount' => 'required',
        ]);

        try {

            $userId = $data['user_id'];
            $amount = $data['amount'];
            $methodSaved = "cash";

            $reference ="Tnx-".Str::random(15)."-Tnx" ?? 'N/A';
            $account = Account::where('user_id', $userId)->first();

            //deposit
            if ($data['type'] === 'deposit') {

                if (!$account) {
                    $account = Account::create([
                        'user_id' => $userId,
                        'balance' => 0,
                    ]);
                }

                $account->balance += $amount;
                $account->save();

                $method = 'deposit';
            } else {

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
          $transaction = Transaction::create([
                'account_id'   => $account->account_id,
                'agent_id'     => $userId,
                'type'         => $method,
                'method'       => $methodSaved,
                'amount'       => $amount,
                'status'       => 'success',
                'reference_no' => $reference,
                'remarks'      => 'Done Via Agent Cash received',
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
