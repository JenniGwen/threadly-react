<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * GET /api/posts  (butuh token)
     *
     * user_id tidak perlu dikirim lagi lewat query: middleware auth.token
     * sudah tahu siapa yang login lewat $request->user().
     */
    public function index(Request $request): JsonResponse
    {
        $posts = Post::latest('id')->get();
        $users = User::all();
        $reactions = Reaction::where('user_id', $request->user()->id)
            ->pluck('type', 'post_id');

        return response()->json(compact('posts', 'users', 'reactions'));
    }

    /**
     * POST /api/posts  (butuh token)
     * Body: { content }
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        // Penulis diambil dari user yang login, bukan dari body → tidak bisa dipalsukan.
        $post = $request->user()->posts()->create($request->validated());

        return response()->json(compact('post'), 201);
    }
}
