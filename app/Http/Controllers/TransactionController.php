<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller

{

    public function search(Request $request)
    {
        $search = $request->search;

        return Account::with('user')
            ->where(function ($query) use ($search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%");
                })
                    ->orWhere('account_number', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get();
    }



    public function create(Request $request)
    {
        return Inertia::render("Accountant/MakeTransaction");
    }

    // Store a new transaction
    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,account_id',
            'type' => 'required|in:deposit,withdrawal',
            'method' => 'required|in:cash,mtn_momo,orange_money',
            'amount' => 'required|numeric|min:1',
            'agent_id' => 'nullable|exists:users,user_id'
        ]);

        $account = Account::findOrFail($request->account_id);

        DB::transaction(function () use ($account, $request) {
            // Create transaction record
            $transaction = Transaction::create([
                'account_id' => $account->account_id,
                'agent_id' => $request->agent_id ?? null,
                'type' => $request->type,
                'method' => $request->method,
                'amount' => $request->amount,
                'status' => 'success', // For offline/cash or assume successful
            ]);

            // Update account balance
            if ($request->type === 'deposit') {
                $account->balance += $request->amount;
            } else if ($request->type === 'withdrawal') {
                if ($request->amount > $account->balance) {
                    throw new \Exception('Insufficient balance');
                }
                $account->balance -= $request->amount;
            }

            $account->save();
        });

        return redirect()->back()->with('success', 'Transaction completed successfully!');
    }

    //     // List all transactions for a user or agent
    //     public function index()
    //     {
    //         $transactions = [];

    //         if (Auth::user()->role->role_name === 'agent') {
    //             // Agent sees transactions in their zones
    //             $transactions = Transaction::whereIn('account_id', Auth::user()->zones()->with('users')->get()->pluck('users')->flatten()->pluck('account.account_id'))->get();
    //         } else {
    //             // Other staff/admins can see all transactions for their branch
    //             $transactions = Transaction::with('account.user')->get();
    //         }

    //         return view('transactions.index', compact('transactions')) }

}
