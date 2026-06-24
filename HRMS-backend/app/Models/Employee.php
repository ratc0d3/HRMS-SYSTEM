<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'employee_code',
    'full_name',
    'email',
    'contact_number',
    'position',
    'department',
    'date_hired',
    'employment_status',
])]
class Employee extends Model
{
    use HasFactory;

    protected $casts = [
        'date_hired' => 'date',
    ];

    /**
     * Get the salary record for this employee.
     */
    public function salary(): HasOne
    {
        return $this->hasOne(Salary::class);
    }

    /**
     * Get the attendance records for this employee.
     */
    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get the payroll records for this employee.
     */
    public function payroll(): HasMany
    {
        return $this->hasMany(Payroll::class);
    }

    /**
     * Generate the employee code.
     */
    public static function generateEmployeeCode(): string
    {
        $lastEmployee = self::orderBy('id', 'desc')->first();
        $nextNumber = $lastEmployee ? intval(substr($lastEmployee->employee_code, 4)) + 1 : 1;
        return 'EMP-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}