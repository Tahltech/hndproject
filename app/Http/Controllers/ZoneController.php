<?php

namespace App\Http\Controllers;

use App\Models\User;

use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ZoneController extends Controller
{
    public function agents(Request $request)
    {
          // find that specific bank
         if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $branchId = Auth::user()->branch_id;
        $agents = DB::table('users')
            ->join('spatie_roles', 'users.role_id', '=', 'spatie_roles.id')
            ->where('users.branch_id', $branchId)
            ->where('spatie_roles.name', 'agent')
            ->select('users.*', 'users.full_name as agentname')
            ->get();

            return response()->json([
                'agents' => $agents,
            ]);


        //dd($agents);
    }
}
