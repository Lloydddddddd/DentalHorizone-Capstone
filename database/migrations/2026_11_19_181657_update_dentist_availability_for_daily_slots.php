<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dentist_availability', function (Blueprint $table) {
            // Max number of patients the clinic will accept on this day
            $table->unsignedInteger('max_slots')->default(10)->after('available_date');

            // Optional: mark the day as closed (holiday, etc.)
            $table->boolean('is_closed')->default(false)->after('end_time');

            // Optional notes (e.g. "Half day only", "Dr. only until 12nn")
            $table->string('notes')->nullable()->after('is_closed');

            // Make sure one row per date only
            $table->unique('available_date');
        });
    }

    public function down(): void
    {
        Schema::table('dentist_availability', function (Blueprint $table) {
            $table->dropUnique(['available_date']);
            $table->dropColumn(['max_slots', 'is_closed', 'notes']);
        });
    }
};