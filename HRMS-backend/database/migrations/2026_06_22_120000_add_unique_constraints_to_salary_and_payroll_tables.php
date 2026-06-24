<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('salaries', function (Blueprint $table) {
            $table->unique('employee_id');
        });

        Schema::table('payroll', function (Blueprint $table) {
            $table->unique(['employee_id', 'payroll_date']);
        });
    }

    public function down(): void
    {
        Schema::table('payroll', function (Blueprint $table) {
            $table->dropUnique(['employee_id', 'payroll_date']);
        });

        Schema::table('salaries', function (Blueprint $table) {
            $table->dropUnique(['employee_id']);
        });
    }
};
