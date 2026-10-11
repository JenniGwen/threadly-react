<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'content', 'likes', 'dislikes'])]
class Post extends Model
{
    /** Penulis post ini. */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Semua reaksi pada post ini. */
    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }
}
