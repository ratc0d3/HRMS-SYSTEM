<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'employee_id',
    'basic_salary',
    'allowance',
    'deductions',
    'net_salary',
    'payroll_date',
])]
class Payroll extends Model
{
    use HasFactory;

    protected $table = 'payroll';

    protected $casts = [
        'basic_salary' => 'decimal:2',
        'allowance' => 'decimal:2',
        'deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'payroll_date' => 'date',
    ];

    /**
     * Get the employee that owns this payroll record.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
