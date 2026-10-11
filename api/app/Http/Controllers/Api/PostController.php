<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * GET /api/posts?user_id=1
     *
     * Mengembalikan semua post + semua user (biar FE bisa cari penulisnya),
     * plus reaksi milik user yang sedang login: { [post_id]: "like" | "dislike" }.
     *
     * compact('posts', 'users', 'reactions') == ['posts' => $posts, 'users' => $users, ...]
     */
    public function index(Request $request): JsonResponse
    {
        $posts = Post::latest('id')->get();
        $users = User::all();

        $reactions = [];
        if ($request->filled('user_id')) {
            $reactions = Reaction::where('user_id', $request->integer('user_id'))
                ->pluck('type', 'post_id');
        }

        return response()->json(compact('posts', 'users', 'reactions'));
    }

    /**
     * POST /api/posts
     * Body: { user_id, content }
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'content' => ['required', 'string', 'max:280'],
        ]);

        $post = Post::create($data);

        return response()->json(compact('post'), 201);
    }
}
