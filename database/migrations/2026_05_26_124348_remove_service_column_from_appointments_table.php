<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['service']);
            $table->dropColumn('service');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->unsignedBigInteger('service');

            $table->foreign('service')
                  ->references('id')
                  ->on('services')
                  ->onDelete('cascade');
        });
    }
};