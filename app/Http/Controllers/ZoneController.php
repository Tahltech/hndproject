<?php

namespace App\Http\Controllers;


use App\Models\User;

use App\Models\Zone;
use App\Models\agentZone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\TryCatch;

class ZoneController extends Controller
{


    public function agents(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $branchId = Auth::user()->branch_id;

        $agents = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.role_id') // updated table and column
            ->leftJoin('agent_zones', function ($join) use ($branchId) {
                $join->on('users.user_id', '=', 'agent_zones.agent_id')
                    ->where('agent_zones.branch_id', '=', $branchId);
            })
            ->leftJoin('zones', 'agent_zones.zone_id', '=', 'zones.zone_id')
            ->where('users.branch_id', $branchId)
            ->where('roles.role_name', 'agent')
            ->select(
                'users.*',
                'users.full_name as agentname',
                'agent_zones.zone_id',
                'zones.name',
                DB::raw('CASE WHEN agent_zones.agent_id IS NULL THEN 0 ELSE 1 END as is_assigned')
            )->get();

        return response()->json([
            'agents' => $agents,
        ]);
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

        if ($agent) {
            return redirect()->route("branchadmindashboard")->with("error", "Agent already assined to a zone");
        }

        if (!$request) {
            return redirect()->route("branchadmindashboard")->with("error", "Agent does'nt exist");
        }
        try {
            agentZone::create([
                'agent_id'  => $request->agent_id,
                'zone_id'   => $request->zone_id,
                'branch_id' => Auth::user()->branch_id,
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }



        $agentIf =  DB::table('users')->where('user_id', '=', $request->agent_id)->first();

        if ($agentIf->zone_id) {
            return redirect()->route("branchadmindashboard")->with("error", "Agent already have a zone");
        }
        DB::table('users')
            ->where('user_id', $request->agent_id)
            ->update(['zone_id' => $request->zone_id]);


        return redirect()->route('branchadmindashboard')->with('success', 'Agent assigned successfully');
    }

    public function deassignZone(Request $request)
    {
        $data = $request->validate([
            'zone_id' => 'required',
        ]);

        // Find the agent-zone relationship
        $agentZone = agentZone::where('zone_id', $request->zone_id)->first();

        if (!$agentZone) {
            return redirect()
                ->route('branchadmindashboard')
                ->with('error', 'No agent assigned to this zone');
        }

        // Remove zone from user table
        DB::table('users')
            ->where('user_id', $agentZone->agent_id)
            ->update(['zone_id' => null]);

        // Delete agent-zone record
        $agentZone->delete();

        return redirect()
            ->route('branchadmindashboard')
            ->with('success', 'Agent de-assigned successfully');
    }
}
