<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    public function handle($request, Closure $next, $permission)
    {

       

        /** @var \App\Models\User&\Spatie\Permission\Traits\HasRoles $user */

        $user = Auth::user();

        if (! $user) {
            abort(403, 'You are not logged in.');
        }

        if ($user->status !== 'active') {
            abort(403, 'Your account is not active.');
        }

        if (! $user->can($permission)) {
            abort(403, 'You do not have permission.');
        }

        return $next($request);
    }
}
