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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code')->unique()->comment('Auto-generated like EMP-0001');
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('contact_number')->nullable();
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->date('date_hired');
            $table->enum('employment_status', ['Active', 'Resigned', 'On Leave'])->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
