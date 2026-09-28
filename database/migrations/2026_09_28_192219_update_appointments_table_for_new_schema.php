<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {

            $table->foreignId('user_id')
                ->nullable()
                ->after('patient_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->string('appointment_status', 50)
                ->nullable()
                ->after('visit_status');

        });

        DB::statement(
            "UPDATE appointments 
             SET appointment_status = visit_status"
        );
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {

            $table->dropForeign(['user_id']);

            $table->dropColumn([
                'user_id',
                'appointment_status'
            ]);

        });
    }
};