<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Login');
})->middleware('guest')->name('login');

Route::post('/login', [LoginController::class, 'store'])
    ->middleware('guest')
    ->name('login.store');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/history', function (Request $request) {
        return Inertia::render('History', [
            'user' => $request->user(),
        ]);
    })->name('history');

    Route::post(
        '/attendance/check-in',
        [AttendanceController::class, 'checkIn'],
    )->name('attendance.check-in');

    Route::post(
        '/attendance/check-out',
        [AttendanceController::class, 'checkOut'],
    )->name('attendance.check-out');

    Route::post('/logout', [LoginController::class, 'destroy'])
        ->name('logout');
});