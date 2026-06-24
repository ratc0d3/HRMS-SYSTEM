<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'employee_id',
    'attendance_date',
    'time_in',
    'time_out',
    'status',
])]
class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';

    protected $casts = [
        'attendance_date' => 'date',
        'time_in' => 'string',
        'time_out' => 'string',
    ];

    /**
     * Get the employee that owns this attendance record.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}