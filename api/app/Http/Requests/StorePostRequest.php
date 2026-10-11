<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        // user_id tidak lagi dikirim dari body; penulis = user yang login (lihat middleware auth.token)
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:280'],
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'Post tidak boleh kosong.',
            'content.max' => 'Post maksimal :max karakter.',
        ];
    }

    /**
     * Dijalankan SEBELUM rules(): rapikan input dulu (trim spasi),
     * sama seperti content.trim() di PostComposer.jsx.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'content' => trim((string) $this->input('content')),
        ]);
    }
}
