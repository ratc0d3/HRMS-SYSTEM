<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\SalaryController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('employees', EmployeeController::class);

    Route::get('/salaries', [SalaryController::class, 'index']);
    Route::get('/salaries/{employee_id}', [SalaryController::class, 'show']);
    Route::post('/salaries', [SalaryController::class, 'store']);

    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::delete('/attendance/{attendance}', [AttendanceController::class, 'destroy']);

    Route::get('/payroll', [PayrollController::class, 'index']);
    Route::post('/payroll/generate', [PayrollController::class, 'generate']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
});
