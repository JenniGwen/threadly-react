<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Body: { username, password }  →  { user, token }
     *
     * Validasi sudah ditangani LoginRequest sebelum method ini jalan.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::where('username', $data['username'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Username atau password salah',
            ], 401);
        }

        // Buat token baru tiap login. FE simpan token ini dan kirim di header.
        $token = Str::random(60);
        $user->update(['api_token' => $token]);

        return response()->json(compact('user', 'token'));
    }

    /**
     * GET /api/me  (butuh token)
     * Dipakai FE saat refresh halaman: "token yang kusimpan masih valid nggak?"
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    /**
     * POST /api/logout  (butuh token)
     * Hapus token di DB supaya tidak bisa dipakai lagi.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->update(['api_token' => null]);

        return response()->json(['message' => 'Berhasil logout']);
    }
}
