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
        Schema::table('appointments', function (Blueprint $table) {
            // First drop the foreign key constraint
            $table->dropForeign(['service']);
            // Then drop the column
            $table->dropColumn('service');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->unsignedBigInteger('service')->nullable();
            $table->foreign('service')->references('id')->on('services')->onDelete('cascade');
        });
    }
};
