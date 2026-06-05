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
            if (!Schema::hasColumn('patients', 'complaint')) {
                $table->string('complaint')->nullable()->after('occupation');
            }
            if (!Schema::hasColumn('patients', 'date_of_visit')) {
                $table->dateTime('date_of_visit')->nullable()->after('complaint');
            }
            if (!Schema::hasColumn('patients', 'next_appointment')) {
                $table->dateTime('next_appointment')->nullable()->after('date_of_visit');
            }
            if (!Schema::hasColumn('patients', 'service')) {
                $table->string('service')->nullable()->after('next_appointment');
            }
            if (!Schema::hasColumn('patients', 'visit_status')) {
                $table->string('visit_status')->nullable()->after('service');
            }
            if (!Schema::hasColumn('patients', 'status')) {
                $table->string('status')->nullable()->after('visit_status');
            }
            if (!Schema::hasColumn('patients', 'patient_status')) {
                $table->string('patient_status')->nullable()->after('status');
            }
            if (!Schema::hasColumn('patients', 'debit')) {
                $table->decimal('debit', 10, 2)->nullable()->after('patient_status');
            }
            if (!Schema::hasColumn('patients', 'credit')) {
                $table->decimal('credit', 10, 2)->nullable()->after('debit');
            }
            if (!Schema::hasColumn('patients', 'balance')) {
                $table->decimal('balance', 10, 2)->nullable()->after('credit');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
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
};
