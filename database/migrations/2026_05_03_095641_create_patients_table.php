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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name', 100);
            $table->string('address', 200);
            $table->string('telephone', 50);
            $table->integer('age');
            $table->string('occupation', 100);
            $table->string('complaint', 200);
            $table->dateTime('date_of_visit');
            $table->dateTime('next_appointment')->nullable();
            $table->string('service', 100);
            $table->string('visit_status', 50);
            $table->string('status', 50);
            $table->string('patient_status', 50);
            $table->decimal('debit', 10, 2);
            $table->decimal('credit', 10, 2);
            $table->decimal('balance', 11, 2)->nullable(); // computed in app logic
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
