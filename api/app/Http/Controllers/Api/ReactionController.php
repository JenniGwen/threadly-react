<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Reaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReactionController extends Controller
{
    /**
     * POST /api/posts/{post}/react
     * Body: { user_id, type: "like" | "dislike" }
     *
     * Logika sama persis dengan handleLike / handleDislike di App.jsx:
     *  - belum react        → tambah reaksi, counter +1
     *  - react tipe sama    → batalkan, counter -1
     *  - react tipe berbeda → pindah, counter lama -1 dan counter baru +1
     */
    public function react(Request $request, Post $post): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'type' => ['required', 'in:like,dislike'],
        ]);

        $myReaction = DB::transaction(function () use ($post, $data) {
            $existing = Reaction::where('user_id', $data['user_id'])
                ->where('post_id', $post->id)
                ->first();

            $counter = fn (string $type) => $type === Reaction::LIKE ? 'likes' : 'dislikes';

            if (! $existing) {
                Reaction::create([...$data, 'post_id' => $post->id]);
                $post->increment($counter($data['type']));

                return $data['type'];
            }

            if ($existing->type === $data['type']) {
                $existing->delete();
                $post->decrement($counter($data['type']));

                return null;
            }

            $post->decrement($counter($existing->type));
            $post->increment($counter($data['type']));
            $existing->update(['type' => $data['type']]);

            return $data['type'];
        });

        $post->refresh();

        return response()->json([
            'post' => $post,
            'my_reaction' => $myReaction,
        ]);
    }
}
