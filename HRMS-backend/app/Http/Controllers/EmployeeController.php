<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of all employees.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Employee::query();

        // Search by name or email (sanitized to prevent SQL injection)
        if ($search = $request->query('search')) {
            $searchTerm = '%' . addcslashes($search, '%_') . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('full_name', 'like', $searchTerm)
                  ->orWhere('email', 'like', $searchTerm);
            });
        }

        // Filter by employment status
        if ($status = $request->query('status')) {
            $query->where('employment_status', $status);
        }

        $employees = $query->orderBy('id', 'desc')->get();

        return $this->success('Employees retrieved', $employees);
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee): \Illuminate\Http\JsonResponse
    {
        return $this->success('Employee retrieved', $employee);
    }

    /**
     * Store a newly created employee.
     */
    public function store(StoreEmployeeRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();
        $validated['employee_code'] = Employee::generateEmployeeCode();

        $employee = Employee::create($validated);

        return $this->success('Employee created successfully', $employee, 201);
    }

    /**
     * Update the specified employee.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();
        $employee->update($validated);

        return $this->success('Employee updated successfully', $employee);
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(Employee $employee): \Illuminate\Http\JsonResponse
    {
        $employee->delete();

        return $this->success('Employee deleted successfully');
    }
}