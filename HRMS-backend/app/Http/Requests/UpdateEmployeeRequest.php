<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $employee = $this->route('employee');
        $employeeId = is_object($employee) ? $employee->id : $employee;

        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('employees', 'email')->ignore($employeeId)],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'position' => ['nullable', 'string', 'max:100'],
            'department' => ['nullable', 'string', 'max:100'],
            'date_hired' => ['required', 'date'],
            'employment_status' => ['required', 'in:Active,Resigned,On Leave'],
        ];
    }
}
