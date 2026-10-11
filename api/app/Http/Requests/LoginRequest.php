<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request = tempat aturan validasi dikumpulkan, supaya controller tetap tipis.
 * Kalau validasi gagal, Laravel otomatis balas 422 { message, errors } untuk request API.
 */
class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // siapa pun boleh mencoba login
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'alpha_dash'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Username wajib diisi.',
            'username.alpha_dash' => 'Username hanya boleh huruf, angka, strip, dan underscore.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal :min karakter.',
        ];
    }
}
