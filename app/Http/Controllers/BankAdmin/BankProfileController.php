<?php

namespace App\Http\Controllers\BankAdmin;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Stmt\TryCatch;

class BankProfileController extends Controller
{
    /**
     * Get authenticated bank profile
     */
    public function show()
    {
        $user = Auth::user();

        $bank = Bank::where('bank_id', $user->bank_id)->firstOrFail();

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
            'email' => 'nullable|string|max:50',
            'registration_number' => 'nullable|string|max:100',
        ]);

        $bank = Bank::findOrFail(Auth::user()->bank_id);

        $bank->update([
            'name' => $request->name,
            'short_name' => $request->short_name,
            'registration_number' => $request->registration_number,
        ]);

        return back()->with("success", "bank Info updated successfuully");
    }

    /**
     * Update bank branding (logo & colors)
     */
    public function updateBranding(Request $request)
    {
        $data = $request->validate([
            'quote' => 'nullable|string|max:200',
            'profile_photo' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        $bank = Bank::findOrFail(Auth::user()->bank_id);

        // Update quote
        if (isset($data['quote'])) {
            $bank->quotes = $data['quote'];
        }

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {

            // Delete old photo if exists
            if ($bank->profile_photo) {
                Storage::disk('public')->delete('bank_logos/' . $bank->profile_photo);
            }

            // Generate clean unique filename
            $filename = time() . '_' . $request->file('profile_photo')->getClientOriginalName();

            // Store file
            $request->file('profile_photo')->storeAs(
                'bank_logos',
                $filename,
                'public'
            );

            // Save filename in DB
            $bank->profile_photo = $filename;
        }

        $bank->save();

        return back()->with('success', 'Branding updated successfully.');
    }

    /**
     * Update contact information
     */
    public function updateContact(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
        ]);

        $bank = Bank::findOrFail(Auth::user()->bank_id);
try {
    
        $bank->update([
            
            'contact_number' => $request->phone,
            'address' => $request->address,
        ]);

        return back()->with("success", "Bank Contact Details Updated Successfully");
} catch (\Throwable $th) {
    //throw $th;
    return back()->with("error", "Error trying to update Bank Contack Info try Again Later");
}
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
