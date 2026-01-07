<?php

namespace App\Http\Controllers;

use App\Models\UserKyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;



class UserKycController extends Controller
{
    public function MyKyc()
    {

        return Inertia::render("User/UserKyc");
    }

    public function submit(Request $request)
    {
        $userId = Auth::user()->user_id;


        if (!$userId) {
            abort(401, 'Unauthenticated.');
        }

        $request->validate([
            'passport_photo'     => 'required|image|max:4096',
            'id_card_front'      => 'required|image|max:4096',
            'id_card_back'       => 'required|image|max:4096',
            'proof_of_address'   => 'required|image|max:4096',
        ]);

        try {
            $data = [];

            foreach (
                [
                    'passport_photo',
                    'id_card_front',
                    'id_card_back',
                    'proof_of_address',
                ] as $field
            ) {

                if ($request->hasFile($field)) {
                    $file = $request->file($field);

                    $filename = $field . '_' . Str::uuid() . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('public/kyc', $filename);

                    $data[$field] = $filename;
                }
            }

            UserKyc::updateOrCreate(
                ['user_id' => $userId],
                array_merge($data, [
                    'status' => 'pending',
                ])
            );

            return back()->with('success', 'KYC submitted successfully.');
        } catch (\Throwable $e) {

            Log::error('KYC submission failed', [
                'user_id' => $userId,
                'error'   => $e->getMessage(),
            ]);

            return back()->withErrors([
                'kyc' => 'An error occurred while submitting your KYC. Please try again.',
            ]);
        }
    }
}
