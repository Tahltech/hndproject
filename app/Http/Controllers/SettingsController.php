<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\PHPMailerService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class SettingsController extends Controller
{
    // Show the settings page with authenticated user
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Settings/Settings', [
            'authUser' => $user,
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (! $user) {
            abort(403, 'Unauthenticated.');
        }

        if ($request->hasFile('profile_photo')) {


            if ($user->profile_photo && $user->profile_photo !== 'default-avatar.png') {
                Storage::disk('public')->delete(
                    'profile_photos/' . $user->profile_photo
                );
            }
            $filename = Str::uuid() . '.' .
                $request->file('profile_photo')->getClientOriginalExtension();

            // Store new photo
            $request->file('profile_photo')->storeAs(
                'profile_photos',
                $filename,
                'public'
            );


            $user->profile_photo = $filename;
            $user->save();
        }

        return back()->with('success', 'Profile photo updated successfully.');
    }


    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->user_id, 'user_id'),
            ],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->user_id, 'user_id'),
            ],
            'phone_number' => 'nullable|string|max:20',

        ]);


        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo && $user->profile_photo !== 'default-avatar.png') {
                Storage::disk('public')->delete('profile_photos/' . $user->profile_photo);
            }

            $file = $request->file('profile_photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('profile_photos', $filename, 'public');
            $validated['profile_photo'] = $filename;
        }


        $user->update($validated);

        return  redirect()->back()->with("success", "profile updated successfully");
    }

    public function updatePreferences(Request $request)
    {
        $request->validate([
            'language' => 'required|string|in:English,French',
            'darkMode' => 'required|boolean',
        ]);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->preferences = [
            'language' => $request->language,
            'darkMode' => $request->darkMode,
        ];

        $user->save();

        return back()->with('success', 'Preferences updated successfully');
    }


    public function updateNotifications(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'transactionAlerts' => 'nullable|boolean',
            'promotionalEmails' => 'nullable|boolean',
            'pushNotifications' => 'nullable|boolean',
        ]);

        // Example: store in user table, make sure columns exist
        $user->update($request->only('transactionAlerts', 'promotionalEmails', 'pushNotifications'));

        return back()->with('success', 'Notifications updated successfully.');
    }

    public function updatePasswordRequest(
        Request $request,
        PHPMailerService $mailer
    ) {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|confirmed|min:5',
        ]);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Current password is incorrect'
            ]);
        }

        // generate 6-digit verification code
        $code = random_int(100000, 999999);


        $user->update([
            'password_verification_code' => Hash::make($code),
            'password_verification_expires_at' => now()->addMinutes(10),
        ]);


        $body = view('emails.password-verification', [
            'user' => $user,
            'code' => $code,
        ])->render();


        try {


            $sent = $mailer->sendEmail(
                $user->email,
                'Password Change Verification Code',
                $body
            );


            if (!$sent) {
                Log::error('Email failed silently');
                return back()->with("error", "Email could not be sent");
            }
        } catch (Exception $e) {
            Log::error('PHPMailer error', [
                'message' => $e->getMessage(),
            ]);

            return back()->with("error", "An error occured request the code again");
        }



        // Store new password temporarily in session
        session([
            'pending_password' => Hash::make($request->password)
        ]);

        return back()->with('success', 'Verification code sent to your email.');
    }



    public function confirmPasswordUpdate(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (! $user) {
            abort(403, 'Unauthenticated.');
        }

        // Check expiry
        if (
            !$user->password_verification_expires_at ||
            now()->greaterThan($user->password_verification_expires_at)
        ) {
            return back()->withErrors(['code' => 'Verification code expired']);
        }

        // Verify code
        if (!Hash::check($request->code, $user->password_verification_code)) {
            return back()->withErrors(['code' => 'Invalid verification code']);
        }

        // Get pending password
        $newPassword = session('pending_password');

        if (!$newPassword) {
            return back()->withErrors(['password' => 'Password session expired']);
        }

        // Update password
        $user->update([
            'password' => $newPassword,
            'password_verification_code' => null,
            'password_verification_expires_at' => null,
        ]);

        session()->forget('pending_password');

        return back()->with('success', 'Password updated successfully');
    }
}
