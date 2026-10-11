<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            // Siapa yang nulis post ini. Kalau user dihapus, post-nya ikut terhapus.
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Maksimal 280 karakter, sama seperti MAX_CHARS di PostComposer.jsx
            $table->string('content', 280);
            // Counter cache supaya FE tinggal baca angka tanpa hitung ulang.
            $table->unsignedInteger('likes')->default(0);
            $table->unsignedInteger('dislikes')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
