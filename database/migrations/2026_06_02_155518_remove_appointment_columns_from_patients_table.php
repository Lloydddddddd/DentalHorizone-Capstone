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
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn([
                'complaint',
                'date_of_visit',
                'next_appointment',
                'service',
                'visit_status',
                'status',
                'patient_status',
                'debit',
                'credit',
                'balance',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->string('complaint')->nullable();
            $table->dateTime('date_of_visit')->nullable();
            $table->dateTime('next_appointment')->nullable();
            $table->string('service')->nullable();
            $table->string('visit_status')->nullable();
            $table->string('status')->nullable();
            $table->string('patient_status')->nullable();
            $table->decimal('debit', 10, 2)->nullable();
            $table->decimal('credit', 10, 2)->nullable();
            $table->decimal('balance', 10, 2)->nullable();
        });
    }
};
