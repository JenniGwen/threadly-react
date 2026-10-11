<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Contoh migration "alter table": menambah kolom ke tabel yang sudah ada,
     * tanpa menghapus data lama.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Token yang dikirim FE lewat header: Authorization: Bearer <token>
            $table->string('api_token', 80)->nullable()->unique()->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('api_token');
        });
    }
};
