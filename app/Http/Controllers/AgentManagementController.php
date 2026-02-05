<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class AgentManagementController extends Controller
{
    public function getAgentUsersTransaction()
    {
        $agent = Auth::user(); 
        $transactions = DB::table('transactions')
            ->join('accounts', 'transactions.account_id', '=', 'accounts.account_id')
            ->join('users', 'accounts.user_id', '=', 'users.user_id')
            ->join('roles', 'users.role_id', '=', 'roles.role_id')
            ->where('users.zone_id', $agent->zone_id)
            ->where('users.branch_id', $agent->branch_id)
            ->where('roles.role_name', 'user')
            ->select(
                'transactions.*',
                'users.full_name',
                'users.user_id',
                'accounts.account_number'
            )
            ->orderBy('transactions.created_at', 'desc')
            ->get();

        return response()->json([
            'transactions' => $transactions
        ], 200);
    }
}
