<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSalaryRequest;
use App\Models\Salary;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
    /**
     * Display a listing of all salaries with employee details.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $salaries = Salary::with('employee')->get()->map(function ($salary) {
            return [
                'id' => $salary->id,
                'employee_id' => $salary->employee_id,
                'employee_name' => $salary->employee->full_name,
                'employee_department' => $salary->employee->department,
                'basic_salary' => $salary->basic_salary,
                'allowance' => $salary->allowance,
                'deductions' => $salary->deductions,
                'net_salary' => $salary->net_salary,
            ];
        });

        return $this->success('Salaries retrieved', $salaries);
    }

    /**
     * Display the specified employee's salary.
     */
    public function show($employeeId): \Illuminate\Http\JsonResponse
    {
        $salary = Salary::where('employee_id', $employeeId)->with('employee')->first();

        if (!$salary) {
            return $this->failed('Salary record not found for this employee', null, 404);
        }

        return $this->success('Salary retrieved', [
            'id' => $salary->id,
            'employee_id' => $salary->employee_id,
            'employee_name' => $salary->employee->full_name,
            'basic_salary' => $salary->basic_salary,
            'allowance' => $salary->allowance,
            'deductions' => $salary->deductions,
            'net_salary' => $salary->net_salary,
        ]);
    }

    /**
     * Store or update the specified employee's salary (upsert).
     */
    public function store(StoreSalaryRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();

        $salary = Salary::updateOrCreate(
            ['employee_id' => $validated['employee_id']],
            [
                'basic_salary' => $validated['basic_salary'],
                'allowance' => $validated['allowance'],
                'deductions' => $validated['deductions'],
            ]
        );

        return $this->success('Salary record saved successfully', [
            'id' => $salary->id,
            'employee_id' => $salary->employee_id,
            'basic_salary' => $salary->basic_salary,
            'allowance' => $salary->allowance,
            'deductions' => $salary->deductions,
            'net_salary' => $salary->net_salary,
        ], 201);
    }
}