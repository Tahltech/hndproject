<?php

namespace App\Http\Controllers\BankAdmin;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BankProfileController extends Controller
{
    /**
     * Get authenticated bank profile
     */
    public function show()
    {
        $user = Auth::user();

        $bank = Bank::where('id', $user->bank_id)->firstOrFail();

        return inertia('Admin1/BankProfile', [
            'bank' => $bank,
        ]);
    }

    /**
     * Update general bank information
     */
    public function updateGeneral(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:50',
            'registration_number' => 'nullable|string|max:100',
            'bank_type' => 'required|string|max:100',
        ]);

        $bank = Bank::findOrFail(Auth::user()->bank_id);

        $bank->update([
            'name' => $request->name,
            'short_name' => $request->short_name,
            'registration_number' => $request->registration_number,
            'bank_type' => $request->bank_type,
        ]);

        return back();
    }

    /**
     * Update bank branding (logo & colors)
     */
    public function updateBranding(Request $request)
    {
        $request->validate([
            'logo' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
            'primary_color' => 'nullable|string|max:20',
            'secondary_color' => 'nullable|string|max:20',
        ]);

        $bank = Bank::findOrFail(Auth::user()->bank_id);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($bank->logo) {
                Storage::disk('public')->delete($bank->logo);
            }

            $path = $request->file('logo')->store('banks/logos', 'public');
            $bank->logo = $path;
        }

        $bank->primary_color = $request->primary_color;
        $bank->secondary_color = $request->secondary_color;

        $bank->save();

        return back();
    }

    /**
     * Update contact information
     */
    public function updateContact(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'website' => 'nullable|url|max:255',
        ]);

        $bank = Bank::findOrFail(Auth::user()->bank_id);

        $bank->update([
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $request->country,
            'website' => $request->website,
        ]);

        return back();
    }

    /**
     * Update operational settings
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'currency' => 'required|string|max:10',
            'timezone' => 'required|string|max:50',
            'business_hours' => 'nullable|string|max:100',
            'transaction_cutoff_time' => 'nullable|string|max:10',
        ]);

        $bank = Bank::findOrFail(Auth::user()->bank_id);

        $bank->update([
            'currency' => $request->currency,
            'timezone' => $request->timezone,
            'business_hours' => $request->business_hours,
            'transaction_cutoff_time' => $request->transaction_cutoff_time,
        ]);

        return back();
    }
}
