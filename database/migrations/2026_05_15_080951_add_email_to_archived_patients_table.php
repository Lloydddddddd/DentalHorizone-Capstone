<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('archived_patients', function (Blueprint $table) {
            $table->string('email')->nullable()->after('occupation');
        });
    }

    public function down()
    {
        Schema::table('archived_patients', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }
};