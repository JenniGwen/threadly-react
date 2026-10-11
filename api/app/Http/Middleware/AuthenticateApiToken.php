<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware = "satpam" yang berdiri di depan controller.
 * Request masuk → middleware cek dulu → kalau lolos, baru diteruskan ke controller.
 *
 * Yang ini mengecek header:  Authorization: Bearer <api_token>
 */
class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        $user = $token ? User::where('api_token', $token)->first() : null;

        if (! $user) {
            return response()->json([
                'message' => 'Kamu belum login atau token tidak valid.',
            ], 401);
        }

        // Tempelkan user ke request, supaya di controller bisa pakai $request->user()
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
