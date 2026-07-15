<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    private function isValidIp(string $ip): bool
    {
        // Izinkan localhost untuk mempermudah development lokal
        if (app()->environment('local') && ($ip === '127.0.0.1' || $ip === '::1')) {
            return true;
        }

        $allowedIp = env('ALLOWED_WIFI_IP', '103.144.14.14');
        return $ip === $allowedIp;
    }

    public function checkIn(Request $request): RedirectResponse
    {
        $clientIp = $request->header('x-real-ip') ?? $request->ip();

        if (! $this->isValidIp($clientIp)) {
            return back()->withErrors([
                'attendance' => 'Kamu harus terhubung ke WiFi kantor (IP: 103.144.14.14) untuk melakukan absensi.',
            ]);
        }

        // Cek batasan waktu masuk (WIB)
        if (! env('BYPASS_TIME_LIMIT', app()->environment('local'))) {
            $currentTime = now()->format('H:i:s');
            $start = env('CHECK_IN_START', '07:00:00');
            $end = env('CHECK_IN_END', '08:00:00');

            if ($currentTime < $start || $currentTime > $end) {
                return back()->withErrors([
                    'attendance' => 'Absen masuk hanya diperbolehkan antara jam 07:00 sampai 08:00 WIB.',
                ]);
            }
        }

        $user = $request->user();

        // Hanya role user yang boleh melakukan absensi.
        abort_if($user->role !== 'user', 403);

        $attendance = $user
            ->attendances()
            ->whereDate('date', today())
            ->first();

        if ($attendance?->check_in_time) {
            return back()->withErrors([
                'attendance' => 'Kamu sudah melakukan absen masuk hari ini.',
            ]);
        }

        if ($attendance) {
            $attendance->update([
                'check_in_time' => now()->format('H:i:s'),
                'status' => 'hadir',
            ]);
        } else {
            $user->attendances()->create([
                'date' => today()->toDateString(),
                'check_in_time' => now()->format('H:i:s'),
                'status' => 'hadir',
            ]);
        }

        return back();
    }

    public function checkOut(Request $request): RedirectResponse
    {
        $clientIp = $request->header('x-real-ip') ?? $request->ip();

        if (! $this->isValidIp($clientIp)) {
            return back()->withErrors([
                'attendance' => 'Kamu harus terhubung ke WiFi kantor (IP: 103.144.14.14) untuk melakukan absensi.',
            ]);
        }

        // Cek batasan waktu pulang (WIB)
        if (! env('BYPASS_TIME_LIMIT', app()->environment('local'))) {
            $currentTime = now()->format('H:i:s');
            $start = env('CHECK_OUT_START', '16:00:00');
            $end = env('CHECK_OUT_END', '17:00:00');

            if ($currentTime < $start || $currentTime > $end) {
                return back()->withErrors([
                    'attendance' => 'Absen pulang hanya diperbolehkan antara jam 16:00 sampai 17:00 WIB.',
                ]);
            }
        }

        $user = $request->user();

        abort_if($user->role !== 'user', 403);

        $attendance = $user
            ->attendances()
            ->whereDate('date', today())
            ->first();

        if (! $attendance || ! $attendance->check_in_time) {
            return back()->withErrors([
                'attendance' => 'Kamu harus absen masuk terlebih dahulu.',
            ]);
        }

        if ($attendance->check_out_time) {
            return back()->withErrors([
                'attendance' => 'Kamu sudah melakukan absen pulang hari ini.',
            ]);
        }

        $attendance->update([
            'check_out_time' => now()->format('H:i:s'),
        ]);

        return back();
    }
}