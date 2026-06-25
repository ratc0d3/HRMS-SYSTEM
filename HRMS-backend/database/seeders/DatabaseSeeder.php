<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Salary;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
            ]
        );

        // Employee data
        $employeesData = [
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'juan.delacruz@company.com',
                'position' => 'Software Developer',
                'department' => 'IT',
                'status' => 'Active',
                'hired_date' => '2024-01-15',
                'contact' => '+63-917-123-4567',
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria.santos@company.com',
                'position' => 'HR Manager',
                'department' => 'Human Resources',
                'status' => 'Active',
                'hired_date' => '2023-06-01',
                'contact' => '+63-918-234-5678',
            ],
            [
                'name' => 'Jose Reyes',
                'email' => 'jose.reyes@company.com',
                'position' => 'Marketing Specialist',
                'department' => 'Marketing',
                'status' => 'On Leave',
                'hired_date' => '2024-03-20',
                'contact' => '+63-919-345-6789',
            ],
            [
                'name' => 'Ana Garcia',
                'email' => 'ana.garcia@company.com',
                'position' => 'Accountant',
                'department' => 'Finance',
                'status' => 'Resigned',
                'hired_date' => '2023-09-10',
                'contact' => '+63-920-456-7890',
            ],
            [
                'name' => 'Carlo Mendoza',
                'email' => 'carlo.mendoza@company.com',
                'position' => 'Web Designer',
                'department' => 'IT',
                'status' => 'Active',
                'hired_date' => '2024-02-01',
                'contact' => '+63-921-567-8901',
            ],
        ];

        // Salary data in Philippine Peso
        $salariesData = [
            ['basic_salary' => 35000.00, 'allowance' => 5000.00, 'deductions' => 2800.00],
            ['basic_salary' => 45000.00, 'allowance' => 6000.00, 'deductions' => 3600.00],
            ['basic_salary' => 28000.00, 'allowance' => 3500.00, 'deductions' => 2240.00],
            ['basic_salary' => 32000.00, 'allowance' => 4000.00, 'deductions' => 2560.00],
            ['basic_salary' => 30000.00, 'allowance' => 4500.00, 'deductions' => 2400.00],
        ];

        // Attendance statuses
        $attendanceStatuses = ['Present', 'Present', 'On Leave', 'Absent', 'Present'];

        // Get the last employee code to continue numbering
        $lastEmployee = Employee::orderBy('id', 'desc')->first();
        $nextNumber = $lastEmployee ? intval(substr($lastEmployee->employee_code, 4)) + 1 : 1;

        // Create employees
        $employees = [];
        foreach ($employeesData as $index => $data) {
            $employees[] = Employee::updateOrCreate(
                ['email' => $data['email']],
                [
                    'employee_code' => 'EMP-' . str_pad($nextNumber + $index, 4, '0', STR_PAD_LEFT),
                    'full_name' => $data['name'],
                    'contact_number' => $data['contact'],
                    'position' => $data['position'],
                    'department' => $data['department'],
                    'date_hired' => $data['hired_date'],
                    'employment_status' => $data['status'],
                ]
            );
        }

        // Create salaries with calculated net_salary
        foreach ($employees as $index => $employee) {
            $salaryData = $salariesData[$index];
            $netSalary = $salaryData['basic_salary'] + $salaryData['allowance'] - $salaryData['deductions'];
            
            Salary::updateOrCreate(
                ['employee_id' => $employee->id],
                [
                    'basic_salary' => $salaryData['basic_salary'],
                    'allowance' => $salaryData['allowance'],
                    'deductions' => $salaryData['deductions'],
                    'net_salary' => $netSalary,
                ]
            );
        }

        // Create attendance for today
        $today = now()->toDateString();
        foreach ($employees as $index => $employee) {
            Attendance::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'attendance_date' => $today,
                ],
                [
                    'time_in' => '09:00',
                    'time_out' => '17:00',
                    'status' => $attendanceStatuses[$index],
                ]
            );
        }
    }
}
