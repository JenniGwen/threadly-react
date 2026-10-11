<?php

namespace App\Http\Requests;

use App\Models\Reaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in([Reaction::LIKE, Reaction::DISLIKE])],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Tipe reaksi wajib diisi.',
            'type.in' => 'Tipe reaksi harus "like" atau "dislike".',
        ];
    }
}
