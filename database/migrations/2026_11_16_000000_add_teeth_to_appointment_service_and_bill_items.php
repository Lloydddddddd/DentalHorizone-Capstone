<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointment_service', function (Blueprint $table) {
            $table->json('teeth')->nullable()->after('note');
        });

        Schema::table('bill_items', function (Blueprint $table) {
            $table->json('teeth')->nullable()->after('subtotal');
        });
    }

    public function down(): void
    {
        Schema::table('appointment_service', function (Blueprint $table) {
            $table->dropColumn('teeth');
        });

        Schema::table('bill_items', function (Blueprint $table) {
            $table->dropColumn('teeth');
        });
    }
};
