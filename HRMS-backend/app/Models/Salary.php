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
])]
class Salary extends Model
{
    use HasFactory;

    protected $casts = [
        'basic_salary' => 'decimal:2',
        'allowance' => 'decimal:2',
        'deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::saving(function ($salary) {
            $salary->net_salary = $salary->basic_salary + $salary->allowance - $salary->deductions;
        });
    }

    /**
     * Get the employee that owns this salary.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}