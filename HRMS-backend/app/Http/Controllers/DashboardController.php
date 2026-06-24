<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display dashboard statistics.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $today = now()->toDateString();

        // Employee statistics
        $totalEmployees = Employee::count();
        $activeEmployees = Employee::where('employment_status', 'Active')->count();
        $onLeaveEmployees = Employee::where('employment_status', 'On Leave')->count();
        $resignedEmployees = Employee::where('employment_status', 'Resigned')->count();

        // Total monthly payroll (sum of net_salary from salaries for Active employees)
        $totalMonthlyPayroll = Salary::whereHas('employee', function ($q) {
            $q->where('employment_status', 'Active');
        })->sum('net_salary');

        // Attendance today breakdown
        $attendanceToday = Attendance::where('attendance_date', $today)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Ensure all statuses are present
        $statuses = ['Present', 'Late', 'Absent', 'On Leave'];
        foreach ($statuses as $status) {
            if (!isset($attendanceToday[$status])) {
                $attendanceToday[$status] = 0;
            }
        }

        return $this->success('Dashboard statistics retrieved', [
            'total_employees' => $totalEmployees,
            'active_employees' => $activeEmployees,
            'on_leave_employees' => $onLeaveEmployees,
            'resigned_employees' => $resignedEmployees,
            'total_monthly_payroll' => $totalMonthlyPayroll,
            'attendance_today' => $attendanceToday,
        ]);
    }
}