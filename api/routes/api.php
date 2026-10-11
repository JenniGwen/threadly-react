<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ReactionController;
use Illuminate\Support\Facades\Route;

// Semua route di file ini otomatis diawali /api dan lewat middleware LogApiRequest.

// Publik: tidak butuh token
Route::post('/login', [AuthController::class, 'login']);

// Terproteksi: wajib kirim header  Authorization: Bearer <token>
Route::middleware('auth.token')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);

    Route::post('/posts/{post}/react', [ReactionController::class, 'react']);
});
