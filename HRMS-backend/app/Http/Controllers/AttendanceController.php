<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Attendance::with('employee');

        // Filter by date
        if ($date = $request->query('date')) {
            $query->where('attendance_date', $date);
        }

        // Filter by employee_id
        if ($employeeId = $request->query('employee_id')) {
            $query->where('employee_id', $employeeId);
        }

        $attendance = $query->orderBy('id', 'desc')->get();

        return $this->success('Attendance records retrieved', $attendance);
    }

    /**
     * Display the specified attendance record.
     */
    public function show(Attendance $attendance): \Illuminate\Http\JsonResponse
    {
        return $this->success('Attendance record retrieved', $attendance);
    }

    /**
     * Store or update attendance (upsert).
     */
    public function store(StoreAttendanceRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();

        $attendance = Attendance::updateOrCreate(
            [
                'employee_id' => $validated['employee_id'],
                'attendance_date' => $validated['attendance_date'],
            ],
            [
                'time_in' => $validated['time_in'] ?? null,
                'time_out' => $validated['time_out'] ?? null,
                'status' => $validated['status'],
            ]
        );

        return $this->success('Attendance recorded successfully', $attendance, 201);
    }

    /**
     * Remove the specified attendance record from storage.
     */
    public function destroy(Attendance $attendance): \Illuminate\Http\JsonResponse
    {
        $attendance->delete();

        return $this->success('Attendance record deleted successfully');
    }
}