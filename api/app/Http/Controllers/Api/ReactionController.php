<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReactRequest;
use App\Models\Post;
use App\Models\Reaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReactionController extends Controller
{
    /**
     * POST /api/posts/{post}/react  (butuh token)
     * Body: { type: "like" | "dislike" }
     *
     * Logika sama persis dengan handleLike / handleDislike di App.jsx:
     *  - belum react        → tambah reaksi, counter +1
     *  - react tipe sama    → batalkan, counter -1
     *  - react tipe berbeda → pindah, counter lama -1 dan counter baru +1
     */
    public function react(ReactRequest $request, Post $post): JsonResponse
    {
        $data = [
            'user_id' => $request->user()->id,
            'type' => $request->validated('type'),
        ];

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
