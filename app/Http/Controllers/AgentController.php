<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        // If user already has ANY zone → deny
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

    public function removeuserzone(Request $request){
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
        ]);


        $user = DB::table('users')->where('user_id', $request->user_id)->first();

        $agent = Auth::user();
        if($user->zone_id != $agent->zone_id){
            return back()->with('error', 'User not from your zone you cant take action contact user zone agent.');

        }


        DB::table('users')
            ->where('user_id', $request->user_id)
            ->update([
                'zone_id' => null,
            ]);

        return back()->with('success', 'User removed from your zone successfully');


    }
}
