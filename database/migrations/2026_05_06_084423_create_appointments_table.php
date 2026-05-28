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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id'); // link to patients table
            $table->string('complaint', 200);
            $table->unsignedBigInteger('service'); // link to services table
            $table->foreign('service')->references('id')->on('services')->onDelete('cascade');
            $table->dateTime('date_of_visit');
            $table->dateTime('next_appointment')->nullable();
            $table->string('visit_status', 50);
            $table->decimal('debit', 10, 2)->default(0);
            $table->decimal('credit', 10, 2)->default(0);
            $table->decimal('balance', 11, 2)->nullable();
            $table->timestamps();

            // Foreign key to patients
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
