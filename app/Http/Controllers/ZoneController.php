<?php

namespace App\Http\Controllers;

use App\Models\agentZone;
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
    public function Zones(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $branchId = Auth::user()->branch_id;


        $zones = DB::table('zones')
            ->where('branch_id', $branchId)
            ->select('zones.*', 'zones.name as zonename')
            ->get();
        return response()->json([
            'zones' => $zones,
        ]);
    }


    public function assignZones(Request $request)
    {
        $zone = $request->validate([
            'agent_id' => 'required',
            'zone_id' => 'required',

        ]);


       $agent = agentZone::where('agent_id', '=', $request->agent_id)->first();

       if($agent){
         return redirect()->route("branchadmindashboard")->with("error", "Agent already assined to a zone");

       }

        if (!$request) {
            return redirect()->route("branchadmindashboard")->with("error", "Agent does'nt exist");
        }

        agentZone::create(
            [
                'agent_id' => $request->agent_id,
                'zone_id' => $request->zone_id,
            ]
        );

        $agentIf =  DB::table('users')->where('user_id', '=', $request->agent_id)->first();

        if ($agentIf->zone_id) {
            return redirect()->route("branchadmindashboard")->with("error", "Agent already have a zone");
        }
        DB::table('users')
            ->where('user_id', $request->agent_id)
            ->update(['zone_id' => $request->zone_id]);


        return redirect()->route('branchadmindashboard')->with('success', 'Agent assigned successfully');
    }
}
