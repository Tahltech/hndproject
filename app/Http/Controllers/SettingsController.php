<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

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
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo && $user->profile_photo !== 'default-avatar.png') {
                Storage::disk('public')->delete('profile_photos/' . $user->profile_photo);
            }

            $file = $request->file('profile_photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('profile_photos', $filename, 'public');
            $validated['profile_photo'] = $filename;
        }

        // Update user
        $user->update($validated);

        return  redirect()->back()->with("success", "profile updated successfully");
    }


    // Update preferences
    public function updatePreferences(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'language' => 'nullable|string',
            'darkMode' => 'nullable|boolean',
        ]);

        $user->update($request->only('language', 'darkMode'));

        return back()->with('success', 'Preferences updated successfully.');
    }

    // Update notifications (optional, can be stored in user table or separate table)
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
}

