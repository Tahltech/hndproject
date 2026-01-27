<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    // $this->routes(function () {
    //     Route::middleware('web')
    //         ->group(base_path('routes/web.php'));

    //     Route::middleware('api')
    //         ->prefix('api')
    //         ->group(base_path('routes/api.php'));

    //     // Add your custom route file
    //     Route::middleware('web')
    //         ->group(base_path('routes/bank_admins.php'));
    // });
}

}
