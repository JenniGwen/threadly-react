<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Data awal yang sama dengan src/data/user.js dan src/data/posts.js di React.
 */
class ThreadlySeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['username' => 'calista', 'display_name' => 'Calista Azzahira'],
            ['username' => 'phoebe',  'display_name' => 'Phoebe Angelina'],
            ['username' => 'tita',    'display_name' => 'Tita Ayu'],
            ['username' => 'raka',    'display_name' => 'Raka Pratama'],
            ['username' => 'alya',    'display_name' => 'Alya Putri'],
        ];

        foreach ($users as $user) {
            User::create([...$user, 'password' => '123456']);
        }

        $posts = [
            ['user_id' => 2, 'content' => 'lagi belajar React ternyata hooks seru juga 😭', 'likes' => 12, 'dislikes' => 1],
            ['user_id' => 3, 'content' => 'ada yang mau belajar React bareng?',              'likes' => 8,  'dislikes' => 0],
            ['user_id' => 4, 'content' => 'hari ini akhirnya selesai bikin component pertama', 'likes' => 15, 'dislikes' => 2],
            ['user_id' => 5, 'content' => 'kenapa CSS selalu bikin layout berantakan 😭',     'likes' => 20, 'dislikes' => 3],
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }
    }
}
