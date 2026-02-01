<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }




    public function boot()
    {
        Inertia::share([
            'authUser' => function () {
                $user = auth()->user();
                if (!$user) return null;

                return [
                    ...$user->toArray(),
                    'preferences' => [
                        'language' => $user->language,
                        'darkMode' => (bool) $user->dark_mode,
                    ],
                ];
            },
        ]);
    }
}
