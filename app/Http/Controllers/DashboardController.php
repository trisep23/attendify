<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $todayAttendance = $user
            ->attendances()
            ->whereDate('date', today())
            ->first();

        $statistics = [
            'hadir' => $user
                ->attendances()
                ->where('status', 'hadir')
                ->count(),

            'izin' => $user
                ->attendances()
                ->where('status', 'izin')
                ->count(),

            // Sementara 0 karena perhitungan alpha membutuhkan
            // aturan hari kerja atau kalender kerja.
            'alpha' => 0,
        ];

        $recentAttendances = $user
            ->attendances()
            ->latest('date')
            ->limit(5)
            ->get([
                'id',
                'date',
                'check_in_time',
                'check_out_time',
                'photo_check_in',
                'photo_check_out',
                'status',
            ]);

        return Inertia::render('Dashboard', [
            'user' => $user,
            'statistics' => $statistics,
            'todayAttendance' => $todayAttendance,
            'recentAttendances' => $recentAttendances,
        ]);
    }
}