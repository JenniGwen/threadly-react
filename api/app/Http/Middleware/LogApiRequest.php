<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Contoh middleware "after": membiarkan request lewat dulu,
 * lalu mencatat hasilnya ke storage/logs/laravel.log.
 */
class LogApiRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request);

        Log::info('API request', [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'user' => $request->user()?->username,
            'ms' => round((microtime(true) - $start) * 1000),
        ]);

        return $response;
    }
}
