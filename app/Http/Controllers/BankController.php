<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Inertia\Inertia;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }
        // get all banks
        $banks = Bank::all();
        return response()->json([
            'banks' => $banks
        ]);
    }
    public function availableBanks(){
        //using the banks model to get the available banks under this project 
      $banks =  Bank::all();

      return Inertia::render("Home", [
        "banks"=> $banks,
      ]);
    }

    public function createAdmin(Request $request,$id)
    {
        // find that specific bank
         if (!$request->ajax() && !$request->wantsJson()) {
            abort(404);
        }

        $bank = Bank::findOrFail($id);
        return inertia('Admin/CreateBankAdmin', [
            'bank' => $bank,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'address' => 'required|max:100',
            'contact_number' => 'required|max:15',
            'email' => 'required|email',

        ]);

        Bank::create([
            'name' => $request->name,
            'address' => $request->address,
            'contact_number' => $request->contact_number,
            'email' => $request->email,

        ]);

        
        return redirect()->route("admindashboard")->with("success", "Bank created succcessfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
