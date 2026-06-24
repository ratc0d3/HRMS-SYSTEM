<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSalaryRequest extends FormRequest
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
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'basic_salary' => ['required', 'numeric', 'min:0'],
            'allowance' => ['required', 'numeric', 'min:0'],
            'deductions' => ['required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Please select an employee.',
            'employee_id.exists' => 'Selected employee does not exist.',
            'basic_salary.required' => 'Basic salary is required.',
            'basic_salary.numeric' => 'Basic salary must be a number.',
            'basic_salary.min' => 'Basic salary cannot be negative.',
            'allowance.required' => 'Allowance is required.',
            'allowance.numeric' => 'Allowance must be a number.',
            'allowance.min' => 'Allowance cannot be negative.',
            'deductions.required' => 'Deductions is required.',
            'deductions.numeric' => 'Deductions must be a number.',
            'deductions.min' => 'Deductions cannot be negative.',
        ];
    }
}
