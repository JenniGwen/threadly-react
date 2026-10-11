<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ReactionController;
use Illuminate\Support\Facades\Route;

// Semua route di file ini otomatis diawali /api
// Contoh: POST /api/login, GET /api/posts

Route::post('/login', [AuthController::class, 'login']);

Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);

Route::post('/posts/{post}/react', [ReactionController::class, 'react']);
