<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
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
            'attendance_date' => ['required', 'date'],
            'status' => ['required', 'in:Present,Late,Absent,On Leave'],
            'time_in' => ['nullable', 'date_format:H:i'],
            'time_out' => ['nullable', 'date_format:H:i'],
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
            'attendance_date.required' => 'Attendance date is required.',
            'attendance_date.date' => 'Please enter a valid date.',
            'status.required' => 'Attendance status is required.',
            'status.in' => 'Invalid attendance status selected.',
            'time_in.date_format' => 'Time in must be in HH:MM format.',
            'time_out.date_format' => 'Time out must be in HH:MM format.',
        ];
    }
}
