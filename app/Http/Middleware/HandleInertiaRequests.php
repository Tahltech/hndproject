<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
public function share(Request $request): array
{
    $user = $request->user();

    return array_merge(parent::share($request), [
        // Flash messages (you already use these)
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error'   => fn () => $request->session()->get('error'),
        ],

        // Auth user data
        'auth' => [
            'user' => $user
                ? [
                    'id'    => $user->user_id,
                    'name'  => $user->full_name,
                    'email' => $user->email,

                    // IMPORTANT: role comes from roles table
                    'role' => [
                        'id'   => $user->role->role_id,
                        'name' => $user->role->role_name, // e.g. it_admin
                    ],

                    'bank'=>[
                        'bank_name'=>$user->bank->name,
                        'bank_profile'=>$user->bank->profile_photo,
                    ],
                    'profile_photo' => $user->profile_photo,
                ]
                : null,
        ],
    ]);
}

}
