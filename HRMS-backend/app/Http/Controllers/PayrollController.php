<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeneratePayrollRequest;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{
    /**
     * Display a listing of payroll records.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Payroll::with('employee');

        // Filter by payroll date
        if ($date = $request->query('payroll_date')) {
            $query->where('payroll_date', $date);
        }

        $payroll = $query->orderBy('id', 'desc')->get();

        return $this->success('Payroll records retrieved', $payroll);
    }

    /**
     * Display the specified payroll record.
     */
    public function show(Payroll $payroll): \Illuminate\Http\JsonResponse
    {
        return $this->success('Payroll record retrieved', $payroll);
    }

    /**
     * Generate payroll for employees.
     */
    public function generate(GeneratePayrollRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();
        $payrollDate = $validated['payroll_date'];
        $employeeId = $validated['employee_id'] ?? null;

        // Generate payroll only for currently employed staff with salary records.
        $baseQuery = Employee::whereIn('employment_status', ['Active', 'On Leave'])
            ->whereHas('salary');

        // Filter by specific employee if provided
        if ($employeeId) {
            $baseQuery->where('id', $employeeId);
            
            // Check if payroll already exists for this employee on this date
            $existingPayroll = Payroll::where('employee_id', $employeeId)
                ->where('payroll_date', $payrollDate)
                ->exists();
            
            if ($existingPayroll) {
                return $this->failed('Payroll already exists for this employee on the selected date. Please choose a different date or employee.', null, 400);
            }
        } else {
            // Check for any existing payroll for the selected date
            $existingPayrollCount = Payroll::where('payroll_date', $payrollDate)->count();
            
            if ($existingPayrollCount > 0) {
                return $this->failed("Payroll already exists for {$existingPayrollCount} employee(s) on {$payrollDate}. Please choose a different date.", null, 400);
            }
        }

        $employees = $baseQuery->get();

        if ($employees->isEmpty()) {
            return $this->failed('No active or on-leave employees with salary records were found.', null, 400);
        }

        // Begin transaction
        DB::beginTransaction();
        try {
            $generatedPayroll = [];

            foreach ($employees as $employee) {
                $salary = $employee->salary;

                $payrollRecord = Payroll::create([
                    'employee_id' => $employee->id,
                    'basic_salary' => $salary->basic_salary,
                    'allowance' => $salary->allowance,
                    'deductions' => $salary->deductions,
                    'net_salary' => $salary->net_salary,
                    'payroll_date' => $payrollDate,
                ]);

                $generatedPayroll[] = $payrollRecord;
            }

            DB::commit();

            return $this->success('Payroll generated successfully', $generatedPayroll, 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->failed('Failed to generate payroll: ' . $e->getMessage(), null, 500);
        }
    }
}
