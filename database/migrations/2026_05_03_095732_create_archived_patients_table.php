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
        Schema::create('archived_patients', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name', 100);
            $table->string('address', 255);
            $table->string('telephone', 20);
            $table->integer('age');
            $table->string('occupation', 100);
            $table->string('complaint', 255);
            $table->dateTime('date_of_visit');
            $table->dateTime('next_appointment')->nullable();
            $table->string('service', 100);
            $table->string('patient_status', 20)->nullable();
            $table->string('visit_status', 20);
            $table->string('status', 20)->nullable();
            $table->decimal('debit', 18, 2)->nullable();
            $table->decimal('credit', 18, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archived_patients');
    }
};
